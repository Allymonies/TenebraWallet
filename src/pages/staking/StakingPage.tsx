// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { useState } from "react";
import { Button, Alert } from "antd";
import { SendOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { translateError } from "@utils/i18n";

import { PageLayout } from "@layout/PageLayout";

import { useWallets } from "@wallets";
import { NoWalletsResult } from "@comp/results/NoWalletsResult";
import { AuthorisedAction } from "@comp/auth/AuthorisedAction";

import { TenebraStake } from "@api/types";

import { useStakingForm } from "./StakingForm";
import { NotifSuccessContents, NotifSuccessButton } from "./Success";
import { useStakingQuery } from "./QueryParamsHook";

import "./StakingPage.less";

export function StakingPage(): JSX.Element {
  const { t } = useTranslation();

  // The success or error alert
  const [alert, setAlert] = useState<JSX.Element | null>(null);

  // Get any pre-filled values from the query parameters
  const { amount } = useStakingQuery();

  // Create the transaction form
  const { isSubmitting, triggerSubmit, stakingForm } = useStakingForm({
    amount,
    onSuccess: stake => setAlert(<AlertSuccess stake={stake} />),
    onError: err => setAlert(<AlertError err={err} />)
  });

  // Don't show the form if there are no wallets.
  const { addressList } = useWallets();
  const hasWallets = addressList?.length > 0;

  function onSubmit() {
    // Close the alert before submission, to forcibly move the form
    setAlert(null);
    triggerSubmit();
  }

  return <PageLayout
    className="staking-page"
    titleKey="staking.title"
    siteTitleKey="staking.siteTitle"
  >
    {hasWallets
      ? <>
        {/* Show the success/error alert if available */}
        {alert}

        <div className="staking-container">
          {stakingForm}

          {/* Send submit button */}
          <AuthorisedAction onAuthed={onSubmit}>
            <Button
              type="primary"
              className="staking-submit"
              icon={<SendOutlined />}
              loading={isSubmitting}

              // Prevent accidental space bar clicks
              onKeyUp={e => e.preventDefault()}
            >
              {t("staking.buttonSubmit")}
            </Button>
          </AuthorisedAction>

          {/* Clearfix for submit button floated right */}
          <div style={{ clear: "both"}} />
        </div>
      </>
      : <NoWalletsResult type="staking" />}
  </PageLayout>;
}

function AlertSuccess({ stake }: { stake: TenebraStake }): JSX.Element {
  const { t } = useTranslation();

  return <Alert
    type="success"
    className="staking-alert"
    showIcon
    closable

    message={t("staking.successNotificationTitle")}
    description={<NotifSuccessContents stake={stake} />}
    action={<NotifSuccessButton stake={stake} />}
  />;
}

function AlertError({ err }: { err: Error }): JSX.Element {
  const { t } = useTranslation();

  return <Alert
    type="error"
    className="staking-alert"
    showIcon
    closable

    message={t("staking.errorNotificationTitle")}
    description={translateError(t, err, "staking.errorUnknown")}
  />;
}
