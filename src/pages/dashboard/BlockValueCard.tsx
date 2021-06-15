// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Card, Skeleton, Typography, Progress } from "antd";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { TenebraValue } from "@comp/tenebra/TenebraValue";

const { Text } = Typography;

export function BlockValueCard(): JSX.Element {
  const { t } = useTranslation();

  const work = useSelector((s: RootState) => s.node.detailedWork);
  const hasNames = (work?.unpaid || 0) > 0;
  const soonestDecrease = Math.min(work ? work.decrease.blocks : 0, work ? work.decreasePenalty.blocks : 0);
  const soonestDecreaseAmount = work ? (work.decrease.blocks < work.decreasePenalty.blocks ? work.decrease.value 
    : (work.decrease.blocks > work.decreasePenalty.blocks ? work.decreasePenalty.value
      : work.decrease.value + work.decreasePenalty.value ) )
  : 0;
  const resetBlock = Math.max(work ? work.decrease.reset : 0, work ? work.decreasePenalty.reset : 0);

  return <Card title={t("dashboard.blockValueCardTitle")} className="kw-card dashboard-card-block-value">
    <Skeleton paragraph={{ rows: 2 }} title={false} active loading={!work}>
      {work && <>
        {/* Main block value */}
        <TenebraValue
          value={work.block_value}
          long
          green={hasNames}
          className="dashboard-block-value-main"
        />

        {hasNames && <>
          {/* Base value + names */}
          <div className="dashboard-block-value-summary">
            <Text type="secondary"><Trans t={t} i18nKey="dashboard.blockValueBaseValue">
              Base value (<TenebraValue value={work.base_value} green />)
            </Trans></Text>
            &nbsp;+&nbsp;
            <b><Link to="/network/names/new">
              {t("dashboard.blockValueBaseValueNames", { count: work.unpaid })}
            </Link></b>
            &nbsp;+&nbsp;
            <span>{t("dashboard.blockValueBaseValuePenalties", { count: work.unpaidPenalties })}</span>
          </div>

          {/* Progress bar */}
          <Progress percent={(resetBlock / 500) * 100} showInfo={false} />

          {/* Decrease and reset */}
          <div className="dashboard-block-value-progress-text">
            {/* Decrease */}
            {soonestDecrease !== resetBlock && <>
              <Trans t={t} i18nKey="dashboard.blockValueNextDecrease" count={soonestDecrease}>
                Decreases by
                <TenebraValue value={soonestDecreaseAmount} />
                in
                <b style={{ whiteSpace: "nowrap" }}>{{ count: soonestDecrease }}</b>
              </Trans>

              <span className="dashboard-block-value-progress-middot">&middot;</span>
            </>}

            {/* Reset */}
            <Trans t={t} i18nKey="dashboard.blockValueReset" count={resetBlock}>
              Resets in
              <b style={{ whiteSpace: "nowrap" }}>{{ count: resetBlock }}</b>
            </Trans>
          </div>
        </>}

        {/* Filler explanation when there are no unpaid names */}
        {!hasNames && (
          <div className="dashboard-block-value-empty-description">
            <Trans t={t} i18nKey="dashboard.blockValueEmptyDescription">
              The block value increases when <Link to="/network/names">names</Link> are purchased.
            </Trans>
          </div>
        )}
      </>}
    </Skeleton>
  </Card>;
}
