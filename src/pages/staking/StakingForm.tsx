// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { useState, useRef, useMemo, useEffect } from "react";
import { Row, Col, Form, FormInstance, Modal } from "antd";
import Select, { RefSelectProps } from "antd/lib/select";

import { useTranslation } from "react-i18next";
import { TranslatedError } from "@utils/i18n";

import { useSelector, useDispatch } from "react-redux";
import { store } from "@app";
import { RootState } from "@store";
import { setLastTxFrom } from "@actions/WalletsActions";

import { useWallets, Wallet } from "@wallets";
import { useMountEffect } from "@utils/hooks";
import { useBooleanSetting, useIntegerSetting } from "@utils/settings";

import { TenebraStake } from "@api/types";
import { makeDepositTransaction, makeWithdrawTransaction } from "@api/transactions";
import { handleStakingError } from "./handleErrors";
import { useAuthFailedModal } from "@api/AuthFailed";

import { AddressPicker } from "@comp/addresses/picker/AddressPicker";
import { AmountInput, StakingFormValues } from "@comp/transactions/AmountInput";
import { StakingConfirmModalContents } from "./StakingConfirmModal";

import awaitTo from "await-to-js";

import Debug from "debug";
const debug = Debug("tenebraweb:send-transaction-form");

// This is from https://github.com/tmpim/Tenebra/blob/a924f3f/src/controllers/transactions.js#L102
// except `+` is changed to `*`.
export const METADATA_REGEXP = /^[\x20-\x7F\n]*$/i;

export type StakingActionType = "deposit" | "withdraw";

interface Props {
  from?: Wallet | string;
  amount?: number;
  form: FormInstance<StakingFormValues>;
  triggerSubmit: () => Promise<void>;
}

function StakingForm({
  from: rawInitialFrom,
  amount: initialAmount,
  form,
  triggerSubmit
}: Props): JSX.Element {
  const { t } = useTranslation();

  // Get the initial wallet to show for the 'from' field. Use the provided
  // wallet if we were given one, otherwise use the saved 'last wallet',
  // or the first wallet we can find.
  const initialFromAddress = typeof rawInitialFrom === "string"
    ? rawInitialFrom : rawInitialFrom?.address;

  const { addressList, walletAddressMap } = useWallets();
  const firstWallet = addressList[0];

  // Validate the lastTxFrom wallet still exists
  const dispatch = useDispatch();
  const lastTxFrom = useSelector((s: RootState) => s.wallets.lastTxFrom);
  const lastTxFromAddress = lastTxFrom && addressList.includes(lastTxFrom)
    ? lastTxFrom : undefined;

  const initialFrom = initialFromAddress || lastTxFromAddress || firstWallet;

  const [from, setFrom] = useState(initialFrom);

  const [formValues, setFormValues] = useState<Partial<StakingFormValues>>();

  // Focus the 'to' input on initial render
  const toRef = useRef<RefSelectProps>(null);
  useMountEffect(() => {
    toRef?.current?.focus();
  });

  function onValuesChange(
    changed: Partial<StakingFormValues>,
    values: Partial<StakingFormValues>
  ) {
    setFrom(values.from || "");
    setFormValues(values);

    // Update and save the lastTxFrom so the next time the modal is opened
    // it will remain on this address
    if (changed.from) {
      const currentWallet = walletAddressMap[changed.from];
      if (currentWallet && currentWallet.address !== lastTxFromAddress) {
        debug("updating lastTxFrom to %s", currentWallet.address);
        dispatch(setLastTxFrom(currentWallet));
        localStorage.setItem("lastTxFrom", currentWallet.address);
      }
    }
  }

  const initialValues: StakingFormValues = useMemo(() => ({
    from: initialFrom,
    amount: initialAmount || 1,
    action:  "deposit"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    rawInitialFrom,
    initialFrom,
    initialAmount
  ]);

  // If the initial values change, refresh the form
  useEffect(() => {
    form?.setFieldsValue(initialValues);
    setFormValues(initialValues);
  }, [form, initialValues]);

  return <Form
    // The form instance is managed by the parent, so that it has control over
    // the behaviour of resetting. For example, a modal dialog would want to
    // reset the form values when the modal closes. It gets created by the
    // `useTransactionForm` hook.
    form={form}
    layout="vertical"
    className="staking-form"

    name="staking"

    initialValues={initialValues}

    onValuesChange={onValuesChange}
    onFinish={triggerSubmit}
  >
    <Row gutter={16}>
      {/* From */}
      <Col span={24} md={12}>
        <AddressPicker
          walletsOnly
          showStake
          name="from"
          label={t("staking.labelWallet")}
          value={from}
          tabIndex={1}
        />
      </Col>

      {/* Mode */}
      <Col span={24} md={12}>
        <Form.Item
          name="action"
          label={t("staking.labelAction")}
        >
          <Select>
            <Select.Option value="deposit">{t("staking.deposit")}</Select.Option>
            <Select.Option value="withdraw">{t("staking.withdraw")}</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>

    {/* Amount */}
    <AmountInput
      from={from === undefined ? initialFrom : from}
      setAmount={amount => form.setFieldsValue({ amount })}
      stakingFormValues={formValues}
      tabIndex={3}
    />
  </Form>;
}

interface StakingFormHookProps {
  from?: Wallet | string;
  amount?: number;
  onError?: (err: Error) => void;
  onSuccess?: (stake: TenebraStake) => void;
  allowClearOnSend?: boolean;
}

interface StakingFormHookResponse {
  form: FormInstance<StakingFormValues>;
  triggerSubmit: () => Promise<void>;
  triggerReset: () => void;
  isSubmitting: boolean;
  stakingForm: JSX.Element;
}

export function useStakingForm({
  from: initialFrom,
  amount: initialAmount,
  onError,
  onSuccess,
  allowClearOnSend
}: StakingFormHookProps = {}): StakingFormHookResponse {
  const { t } = useTranslation();

  const [form] = Form.useForm<StakingFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Used to check for warning on large transactions
  const { walletAddressMap } = useWallets();
  //const url = useSyncNode();

  // Confirmation modal used for when the transaction amount is very large.
  // This is created here to provide a translation context for the modal.
  const [confirmModal, contextHolder] = Modal.useModal();
  // Modal used when auth fails
  const { showAuthFailed, authFailedContextHolder } = useAuthFailedModal();

  // If the form allows it, and the setting is enabled, clear the form when
  // sending a transaction.
  const confirmOnSend = useBooleanSetting("confirmTransactions");
  const clearOnSend = useBooleanSetting("clearTransactionForm");
  const sendDelay = useIntegerSetting("sendTransactionDelay");

  // Called when the modal is closed
  function onReset() {
    form.resetFields();
    setIsSubmitting(false);
  }

  // Take the form values and known wallet and submit the transaction
  async function submitStakingTransaction(
    { amount, action }: StakingFormValues,
    wallet: Wallet
  ): Promise<void> {
    // Manually get the master password from the store state, because this might
    // get called immediately after an auth, which doesn't give the hook time to
    // update this submitTransaction function. The password here is used to
    // decrypt the wallet to make the transaction.
    const masterPassword = store.getState().masterPassword.masterPassword;
    if (!masterPassword)
      throw new TranslatedError("sendTransaction.errorWalletDecrypt");

    // API errors will be bubbled up to the caller
    if (action === "deposit") {
      const stake = await makeDepositTransaction(
        masterPassword,
        wallet,
        amount,
      );

      // Intentionally delay transaction submission, to prevent accidental double
      // clicks on fast networks.
      if (sendDelay > 0)
        await (() => new Promise(resolve => setTimeout(resolve, sendDelay)))();

      // Clear the form if the setting for it is enabled
      if (allowClearOnSend && clearOnSend)
        form.resetFields();

      onSuccess?.(stake);
    } else {
      const stake = await makeWithdrawTransaction(
        masterPassword,
        wallet,
        amount,
      );

      // Intentionally delay transaction submission, to prevent accidental double
      // clicks on fast networks.
      if (sendDelay > 0)
        await (() => new Promise(resolve => setTimeout(resolve, sendDelay)))();

      // Clear the form if the setting for it is enabled
      if (allowClearOnSend && clearOnSend)
        form.resetFields();

      onSuccess?.(stake);
    }

  }

  // Convert API errors to friendlier errors
  const handleError = handleStakingError.bind(handleStakingError,
    onError, showAuthFailed);

  async function onSubmit() {
    setIsSubmitting(true);

    // Get the form values
    const [err, values] = await awaitTo(form.validateFields());
    if (err || !values) {
      // Validation errors are handled by the form
      setIsSubmitting(false);
      return;
    }

    // Find the wallet we're trying to pay from, and verify it actually exists
    // and has a balance (shouldn't happen)
    const [err2, currentWallet] = await awaitTo((async () => {
      const currentWallet = walletAddressMap[values.from];
      if (!currentWallet)
        throw new TranslatedError("sendTransaction.errorWalletGone");
      if (!currentWallet.balance)
        throw new TranslatedError("sendTransaction.errorAmountTooHigh");

      return currentWallet;
    })());

    // Push out any errors with the wallet
    if (err2 || !currentWallet?.balance) {
      onError?.(err2!);
      setIsSubmitting(false);
      return;
    }

    // If the transaction is large (over half the balance), prompt for
    // confirmation before sending
    const { amount } = values;
    // TODO: Anti-midiocy here but I'm too lazy to figure out what it does
    const confirmable = false;//await sha256(url) !== "cadc9145658308ead9ade59730063772f9a4d682650842981d3c075c5240cfee";
    const showConfirm = confirmOnSend || confirmable;
    const isLarge = amount >= currentWallet.balance / 2;
    if (showConfirm || isLarge) {
      // It's large, prompt for confirmation
      confirmModal.confirm({
        title: t("staking.modalTitle"),
        content: <StakingConfirmModalContents
          amount={amount}
          balance={currentWallet.balance}
          key2={showConfirm
            ? "stakingLargeConfirm"
            : undefined}
        />,

        // Transaction looks OK, submit it
        okText: t("staking.buttonSubmit"),
        onOk: () => submitStakingTransaction(values, currentWallet)
          .catch(err => handleError(err, currentWallet))
          .finally(() => setIsSubmitting(false)),

        cancelText: t("dialog.cancel"),
        onCancel: () => setIsSubmitting(false)
      });
    } else {
      // Transaction looks OK, submit it
      submitStakingTransaction(values, currentWallet)
        .catch(err => handleError(err, currentWallet))
        .finally(() => setIsSubmitting(false));
    }
  }

  // Create the transaction form instance here to be rendered by the caller
  const stakingForm = <>
    <StakingForm
      from={initialFrom}
      amount={initialAmount}
      form={form}
      triggerSubmit={onSubmit}
    />

    {/* Give the modals somewhere to find the context from. */}
    {contextHolder}
    {authFailedContextHolder}
  </>;

  return {
    form,
    triggerSubmit: onSubmit,
    triggerReset: onReset,
    isSubmitting,
    stakingForm
  };
}
