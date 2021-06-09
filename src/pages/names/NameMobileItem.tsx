// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { useMemo } from "react";
import { Collapse, Tag } from "antd";

import { Trans } from "react-i18next";
import { useTFns } from "@utils/i18n";

import { TenebraName } from "@api/types";
import { useWallets } from "@wallets";

import { TenebraNameLink } from "@comp/names/TenebraNameLink";
import { ContextualAddress } from "@comp/addresses/ContextualAddress";
import { DateTime } from "@comp/DateTime";

import { OpenEditNameFn } from "./mgmt/NameEditModalLink";
import { OpenSendTxFn } from "@comp/transactions/SendTransactionModalLink";

import { NameMobileItemActions } from "./NameMobileItemActions";

interface Props {
  name: TenebraName;

  openNameEdit: OpenEditNameFn;
  openSendTx: OpenSendTxFn;
}

export function NameMobileItem({
  name,
  openNameEdit,
  openSendTx
}: Props): JSX.Element {
  const { t, tStr, tKey } = useTFns("names.");

  // Used to change the actions depending on whether or not we own the name
  const { walletAddressMap } = useWallets();
  const isOwn = !!walletAddressMap[name.owner];

  const hasARecord = !!name.a;
  const isUnpaid = name.unpaid > 0;
  const hasTags = hasARecord || isUnpaid;

  const itemHead = useMemo(() => (
    <div className="name-mobile-item-header">
      {/* Tags (A record, unpaid blocks) */}
      {hasTags && <div className="name-tags">
        {/* A record */}
        {hasARecord && <Tag>{tStr("mobileARecordTag")}</Tag>}

        {/* Unpaid blocks */}
        {isUnpaid && (
          <Tag color="CornFlowerBlue">
            {t(tKey("mobileUnpaidTag"), { count: name.unpaid })}
          </Tag>
        )}
      </div>}

      {/* Name */}
      <TenebraNameLink name={name.name} noLink className="name-name" />

      {/* Owner */}
      <div className="name-owner">
        <Trans i18nKey={tKey("mobileOwner")}>
          <span className="name-field">Owner:</span>
          <ContextualAddress address={name.owner} noLink noTooltip />
        </Trans>
      </div>

      {/* Original owner */}
      {name.original_owner && name.owner !== name.original_owner && (
        <div className="name-original-owner">
          <Trans i18nKey={tKey("mobileOriginalOwner")}>
            <span className="name-field">Original owner:</span>
            <ContextualAddress address={name.original_owner} noLink noTooltip />
          </Trans>
        </div>
      )}

      {/* Registered/updated date */}
      {name.updated
        ? (
          <div className="name-updated">
            <Trans i18nKey={tKey("mobileUpdated")}>
              Updated: <DateTime date={name.updated} />
            </Trans>
          </div>
        )
        : (
          <div className="name-registered">
            <Trans i18nKey={tKey("mobileRegistered")}>
              Registered: <DateTime date={name.registered} />
            </Trans>
          </div>
        )}
    </div>
  ), [
    t, tStr, tKey,
    hasTags, hasARecord, isUnpaid,
    name.name, name.unpaid, name.owner, name.original_owner,
    name.updated, name.registered
  ]);

  return <Collapse ghost className="card-list-item mobile-item-collapse name-mobile-item">
    <Collapse.Panel key={name.name} showArrow={false} header={itemHead}>
      <NameMobileItemActions
        name={name}
        isOwn={isOwn}
        openNameEdit={openNameEdit}
        openSendTx={openSendTx}
      />
    </Collapse.Panel>
  </Collapse>;
}
