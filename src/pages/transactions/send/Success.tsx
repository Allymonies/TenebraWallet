// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Button } from "antd";

import { useTranslation, Trans } from "react-i18next";

import { Link } from "react-router-dom";

import { TenebraTransaction } from "@api/types";
import { TenebraValue } from "@comp/tenebra/TenebraValue";
import { ContextualAddress } from "@comp/addresses/ContextualAddress";

export function NotifSuccessContents({ tx }: { tx: TenebraTransaction }): JSX.Element {
  const { t } = useTranslation();

  return <Trans t={t} i18nKey="sendTransaction.successNotificationContent">
    You sent
    <TenebraValue value={tx.value} />
    from
    <ContextualAddress
      address={tx.from || "UNKNOWN"}
      metadata={tx.metadata}
      source
      neverCopyable
    />
    to
    <ContextualAddress
      address={tx.to}
      metadata={tx.metadata}
      neverCopyable
    />
  </Trans>;
}

export function NotifSuccessButton({ tx }: { tx: TenebraTransaction }): JSX.Element {
  const { t } = useTranslation();

  return <Link to={"/network/transactions/" + encodeURIComponent(tx.id)}>
    <Button type="primary">
      {t("sendTransaction.successNotificationButton")}
    </Button>
  </Link>;
}
