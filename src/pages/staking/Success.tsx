// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Button } from "antd";

import { useTranslation, Trans } from "react-i18next";

import { Link } from "react-router-dom";

import { TenebraStake } from "@api/types";
import { TenebraValue } from "@comp/tenebra/TenebraValue";
import { ContextualAddress } from "@comp/addresses/ContextualAddress";

export function NotifSuccessContents({ stake }: { stake: TenebraStake }): JSX.Element {
  const { t } = useTranslation();

  return <Trans t={t} i18nKey="staking.successNotificationContent">
    Your new stae balance
    <TenebraValue value={stake.stake} />
    after a staking action with
    <ContextualAddress
      address={stake.owner || "UNKNOWN"}
      source
      neverCopyable
    />
  </Trans>;
}

export function NotifSuccessButton({ stake }: { stake: TenebraStake }): JSX.Element {
  const { t } = useTranslation();

  return <Link to={"/network/addresses/" + encodeURIComponent(stake.owner) + "/transactions"}>
    <Button type="primary">
      {t("staking.successNotificationButton")}
    </Button>
  </Link>;
}
