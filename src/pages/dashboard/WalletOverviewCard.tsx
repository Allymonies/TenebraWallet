// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under GPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import React from "react";
import { Card, Row, Col, Button } from "antd";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Wallet, useWallets } from "../../krist/wallets/Wallet";

import { KristValue } from "../../components/KristValue";
import { Statistic } from "../../components/Statistic";
import { WalletItem } from "./WalletItem";

import { keyedNullSort } from "../../utils";

export function WalletOverviewCard(): JSX.Element {
  const { wallets } = useWallets();
  const { t } = useTranslation();

  // Turn the wallets into an array, to sort them later
  const clonedWallets = [...Object.values(wallets)];

  // Sum the balance and names of all wallets
  const balance = clonedWallets.filter(w => w.balance !== undefined)
    .reduce((acc, w) => acc + w.balance!, 0);
  const names = clonedWallets.filter(w => w.names !== undefined)
    .reduce((acc, w) => acc + w.names!, 0);

  // Pick the top 4 wallets sorted by balance descending
  const topWallets = [...clonedWallets];
  const sort = keyedNullSort<Wallet>("balance", undefined);
  topWallets.sort((a: Wallet, b: Wallet) => sort(a, b, "descend"));
  topWallets.reverse();

  const top4Wallets = topWallets.slice(0, 4);

  return <Card title={t("dashboard.walletOverviewCardTitle")} className="kw-card dashboard-card-wallets">
    {/* Top row (summaries) */}
    <Row gutter={16} className="dashboard-wallets-top-row">
      {/* Total balance */}
      <Col span={24} xl={12} className="dashboard-wallets-balance">
        <Statistic
          titleKey="dashboard.walletOverviewTotalBalance"
          value={<KristValue value={balance} long green={balance > 0} />}
        />
      </Col>

      {/* Names */}
      <Col span={24} xl={12} className="dashboard-wallets-names">
        <Statistic
          titleKey="dashboard.walletOverviewNames"
          value={t("dashboard.walletOverviewNamesCount", { count: names })}
        />
      </Col>
    </Row>

    {/* Wallet list */}
    {top4Wallets.map(w => <WalletItem key={w.id} wallet={w} />)}

    {/* See more link */}
    <Row className="card-more dashboard-wallets-more">
      <Link to="/wallets">
        {/* Show an 'add wallets' button instead if there are no wallets yet */}
        {clonedWallets.length > 0
          ? t("dashboard.walletOverviewSeeMore", { count: clonedWallets.length })
          : <Button>{t("dashboard.walletOverviewAddWallets")}</Button>}
      </Link>
    </Row>
  </Card>;
}