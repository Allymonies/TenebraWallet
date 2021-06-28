// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { useTranslation, Trans } from "react-i18next";

import { TenebraAddressWithNames } from "@api/lookup";
import { TenebraValue } from "@comp/tenebra/TenebraValue";
import { Wallet } from "@wallets";

interface Props {
  address?: TenebraAddressWithNames;
  nameHint?: boolean;
  stake?: number;
  wallet?: Wallet;
}

export function AddressHint({ address, nameHint, stake, wallet}: Props): JSX.Element {
  const { t } = useTranslation();

  return <span className="address-picker-hint address-picker-address-hint">
    {nameHint
      ? (
        // Show the name count if this picker is relevant to a name transfer
        <Trans t={t} i18nKey="addressPicker.addressHintWithNames">
          Balance: <b>{{ names: address?.names || 0 }}</b>
        </Trans>
      )
      : (
        stake ?
          // Otherwise, show the balance
          (
            <Trans t={t} i18nKey="addressPicker.addressHintWithStake">
              Balance: <TenebraValue value={address?.balance || 0} /> Stake: <TenebraValue value={wallet ? (wallet.stake ?? (stake ?? 0)) : 0} />
            </Trans>
          )
          :
          (
            <Trans t={t} i18nKey="addressPicker.addressHint">
              Balance: <TenebraValue value={address?.balance || 0} />
            </Trans>
          )
      )
    }
  </span>;
}
