// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Dispatch, SetStateAction } from "react";
import { Modal, notification } from "antd";

import { useTranslation } from "react-i18next";
import { translateError } from "@utils/i18n";

import { useWallets, Wallet } from "@wallets";
import { NoWalletsModal } from "@comp/results/NoWalletsResult";

import { TenebraStake } from "@api/types";

import { useStakingForm } from "./StakingForm";
import { NotifSuccessContents, NotifSuccessButton } from "./Success";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;

  from?: Wallet | string;
  to?: string;
}

export function StakingModal({
  visible,
  setVisible,
  from
}: Props): JSX.Element {
  const { t } = useTranslation();

  // Grab a context to display a button in the success notification
  const [notif, contextHolder] = notification.useNotification();

  // Create the transaction form
  const { isSubmitting, triggerSubmit, triggerReset, stakingForm } = useStakingForm({
    from,

    // Display a success notification when the transaction is made
    onSuccess(stake: TenebraStake) {
      notif.success({
        message: t("staking.successNotificationTitle"),
        description: <NotifSuccessContents stake={stake} />,
        btn: <NotifSuccessButton stake={stake} />
      });

      // Close when done
      closeModal();
    },

    // Display errors as notifications in the modal
    onError: err => notification.error({
      message: t("staking.errorNotificationTitle"),
      description: translateError(t, err, "staking.errorUnknown")
    })
  });

  // Don't open the modal if there are no wallets.
  const { addressList } = useWallets();
  const hasWallets = addressList?.length > 0;

  function closeModal() {
    triggerReset();
    setVisible(false);
  }

  return <>
    {hasWallets
      ? (
        <Modal
          visible={visible}

          title={t("staking.modalTitle")}

          onOk={triggerSubmit}
          okText={t("staking.modalSubmit")}
          okButtonProps={isSubmitting ? { loading: true } : undefined}

          onCancel={closeModal}
          cancelText={t("dialog.cancel")}
          destroyOnClose
        >
          {stakingForm}
        </Modal>
      )
      : (
        <NoWalletsModal
          type="staking"
          visible={visible}
          setVisible={setVisible}
        />
      )
    }

    {/* Context for success notification */}
    {contextHolder}
  </>;
}
