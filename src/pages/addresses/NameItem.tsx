// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Row } from "antd";

import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { TenebraName } from "@api/types";
import { TenebraNameLink } from "@comp/names/TenebraNameLink";
import { DateTime } from "@comp/DateTime";

export function NameItem({ name }: { name: TenebraName }): JSX.Element {
  const { t } = useTranslation();

  const nameEl = <TenebraNameLink name={name.name} />;
  const nameLink = "/network/names/" + encodeURIComponent(name.name);
  const nameTime = new Date(name.registered);

  return <Row className="card-list-item address-name-item">
    <div className="name-info">
      {/* Display 'purchased' if this is the original owner, otherwise display
        * 'received'. */}
      {name.owner === name.original_owner
        ? <Trans t={t} i18nKey="address.namePurchased">Purchased {nameEl}</Trans>
        : <Trans t={t} i18nKey="address.nameReceived">Received {nameEl}</Trans>}
    </div>

    {/* Purchase time */}
    <Link to={nameLink}>
      <DateTime date={nameTime} timeAgo small secondary />
    </Link>
  </Row>;
}
