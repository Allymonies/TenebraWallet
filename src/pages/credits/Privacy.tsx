// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Typography } from "antd";

import { Trans } from "react-i18next";
import { useTFns } from "@utils/i18n";

import { Link } from "react-router-dom";

import { useSyncNode } from "@api";

const { Title } = Typography;

export function Privacy(): JSX.Element {
  const { tStr, tKey } = useTFns("credits.privacy.");

  const syncNode = useSyncNode();

  return <div className="credits-privacy" id="privacy">
    <Title level={5}>{tStr("tenebraServer")}</Title>
    <p><Trans i18nKey={tKey("tenebraServerDesc")}>
      The only PII that the
      <a href={syncNode} target="_blank" rel="noopener noreferrer">
        Tenebra server
      </a>
      stores is your IP address, User-Agent and Origin, as part of the webserver
      logs. This information is automatically purged after 30 days.
    </Trans></p>

    <Title level={5}>{tStr("tenebraweb")}</Title>
    <p><Trans i18nKey={tKey("tenebrawebDesc1")}>
      TenebraWeb uses a self-hosted
      <a href="https://sentry.io" target="_blank" rel="noopener noreferrer">
        Sentry
      </a>
      server for automatic error reporting. This system stores your IP address,
      User-Agent, Origin, breadcrumbs, and the details for any errors that get
      automatically reported. This information is automatically purged after 30
      days.
    </Trans></p>

    <p><Trans i18nKey={tKey("tenebrawebDesc2")}>
      If you have an ad-blocking or tracker-blocking extension such as
      <a href="https://github.com/gorhill/uBlock" target="_blank" rel="noopener noreferrer">
        uBlock Origin
      </a>
      <strong>(recommended)</strong>, our Sentry system is already blocked by
      the built-in lists, so you do not have to worry about your privacy. You
      can also opt-out of error reporting in the
      <Link to="/settings">settings page</Link>. That said, if you’d like to
      help us by providing more detailed error reports, then please consider
      making an exception for TenebraWeb in your tracker blocker software. This
      site does not serve ads.
    </Trans></p>

    <p>{tStr("tenebrawebDesc3")}</p>
  </div>;
}
