// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Select } from "antd";

import { useTranslation } from "react-i18next";

import { WalletFormatName, ADVANCED_FORMATS } from "@wallets";
import { useBooleanSetting } from "@utils/settings";

interface Props {
  initialFormat: WalletFormatName;
}

export function SelectWalletFormat({ initialFormat }: Props): JSX.Element {
  const advancedWalletFormats = useBooleanSetting("walletFormats");
  const { t } = useTranslation();

  return <Select>
    <Select.Option value="tenebrawallet">{t("addWallet.walletFormatTenebraWallet")}</Select.Option>

    {(advancedWalletFormats || ADVANCED_FORMATS.includes(initialFormat)) && <>
      <Select.Option value="tenebrawallet_username_appendhashes">{t("addWallet.walletFormatTenebraWalletUsernameAppendhashes")}</Select.Option>
      <Select.Option value="tenebrawallet_username">{t("addWallet.walletFormatTenebraWalletUsername")}</Select.Option>
      <Select.Option value="jwalelset">{t("addWallet.walletFormatJwalelset")}</Select.Option>
    </>}

    <Select.Option value="api">{t("addWallet.walletFormatApi")}</Select.Option>
  </Select>;
}
