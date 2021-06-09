// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { FC, Attributes } from "react";

import { Trans } from "react-i18next";
import { useTFns } from "@utils/i18n";

import { TenebraValue } from "@comp/tenebra/TenebraValue";

interface SendTransactionConfirmModalContentsProps {
  amount: number;
  balance: number;
}

export const SendTransactionConfirmModalContents: FC<Attributes & { key2?: string } & SendTransactionConfirmModalContentsProps> = ({ amount, balance, key2 }) => {
  const { t, tKey } = useTFns("sendTransaction.");

  // Show the appropriate message, if this is just over half the
  // balance, or if it is the entire balance.
  return <Trans
    t={t}
    i18nKey={tKey(key2?.toString() || (amount >= balance
      ? "payLargeConfirmAll"
      : "payLargeConfirmHalf"))}
  >
    Are you sure you want to send <TenebraValue value={amount} />?
    This is over half your balance!
  </Trans>;
};
