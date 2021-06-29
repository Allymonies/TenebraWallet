// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Card, Skeleton } from "antd";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import { useTranslation, Trans} from "react-i18next";

import { TenebraValue } from "@comp/tenebra/TenebraValue";

export function StakeInfoCard(): JSX.Element {
  const { t } = useTranslation();

  const work = useSelector((s: RootState) => s.node.detailedWork);
  const secondsPerBlock = useSelector((s: RootState) => s.node.constants.seconds_per_block);
  const blocksPerYear = (60 * 60 * 24 * 365.24) / secondsPerBlock;
  const totalStaked = work?.total_staked || 0;
  const APY = ((blocksPerYear / totalStaked) * 100).toFixed(2);

  return <Card title={t("dashboard.stakeInfoCardTitle")} className="kw-card dashboard-card-stake-info">
    <Skeleton paragraph={{ rows: 2 }} title={false} active loading={!work}>
      {work && <>
        {/* Main block value */}
        <TenebraValue
          value={totalStaked}
          long
          green={totalStaked > 0}
          className="dashboard-stake-info-main"
        />

        {totalStaked > 0 && <>
          {/* Base value + names */}
          <div className="dashboard-stake-info-summary">
            <div>
              <Trans t={t} i18nKey="dashboard.stakeInfoAPY">
              APY <b>{{APY}}%</b>
              </Trans>
              {/*{t("dashboard.stakeInfoAPY", { apy: APY })}*/}
            </div>
          </div>
        </>}

        {/* Filler explanation when there are no unpaid names */}
        {totalStaked <= 0 && (
          <div className="dashboard-stake-info-empty-description">
            {t("dashboard.stakeInfoEmptyDescription")}
          </div>
        )}
      </>}
    </Skeleton>
  </Card>;
}
