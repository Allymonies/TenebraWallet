// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { useState, useEffect } from "react";
import { Row, Col, Typography, Tooltip, Card } from "antd";
import { GithubOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import * as api from "@api";
import { WhatsNewResponse, Commit } from "./types";
import { getAuthorInfo, criticalError } from "@utils";

import { PageLayout } from "@layout/PageLayout";

import { WhatsNewCard } from "./WhatsNewCard";
import { CommitsCard } from "./CommitsCard";

import "./WhatsNewPage.less";

const { Title } = Typography;

declare const __GIT_COMMITS__: Commit[];
const tenebraWebCommits: Commit[] = __GIT_COMMITS__;

export function WhatsNewPage(): JSX.Element {
  const { t } = useTranslation();

  const syncNode = api.useSyncNode();

  const [tenebraData, setTenebraData] = useState<WhatsNewResponse>();
  const [loading, setLoading] = useState(true);

  // Get the repository URL for TenebraWeb
  const tenebraWebRepo = getAuthorInfo().gitURL;
  // Get the repository URL for the sync node
  const tenebraPackage = useSelector((s: RootState) => s.node.package);

  useEffect(() => {
    // Fetch the 'whats new' and commits from the Tenebra sync node
    api.get<WhatsNewResponse>("whatsnew")
      .then(setTenebraData)
      .catch(criticalError) // TODO: show errors to the user
      .finally(() => setLoading(false));
  }, [syncNode]);

  return <PageLayout
    titleKey="whatsNew.title"
    siteTitleKey="whatsNew.siteTitle"

    className="whats-new-page"
  >
    {/* TenebraWeb */}
    <Title level={2}>
      {t("whatsNew.titleTenebraWeb")}
      <GithubLink repoURL={tenebraWebRepo} />
    </Title>

    <Row gutter={16}>
      {/* TenebraWeb What's new */}
      <Col span={24} lg={12}>
        {/* Temporary card */}
        <Card
          title={t("whatsNew.cardWhatsNewTitle")}
          className="kw-card whats-new-card-whats-new"
        >
          <h1 style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 96,
            height: "100%"
          }}>
            This
          </h1>
        </Card>
      </Col>

      {/* TenebraWeb commits */}
      <Col span={24} lg={12}>
        <CommitsCard
          loading={loading}
          commits={tenebraWebCommits}
          repoURL={tenebraWebRepo}
        />
      </Col>
    </Row>

    {/* Tenebra */}
    <Title level={2} style={{ marginTop: 16 }}>
      {t("whatsNew.titleTenebra")}
      <GithubLink repoURL={tenebraPackage.repository} />
    </Title>

    <Row gutter={16}>
      {/* Tenebra What's new */}
      <Col span={24} lg={12}>
        <WhatsNewCard
          loading={loading}
          whatsNew={tenebraData?.whatsNew}
          baseURL={syncNode}
          repoURL={tenebraPackage.repository}
        />
      </Col>

      {/* Tenebra commits */}
      <Col span={24} lg={12}>
        <CommitsCard
          loading={loading}
          commits={tenebraData?.commits}
          repoURL={tenebraPackage.repository}
        />
      </Col>
    </Row>
  </PageLayout>;
}

function GithubLink({ repoURL }: { repoURL: string }): JSX.Element {
  const { t } = useTranslation();

  return <Tooltip title={t("whatsNew.tooltipGitHub")}>
    <a
      className="whats-new-github-link"
      href={repoURL}
      target="_blank" rel="noopener noreferrer"
    >
      <GithubOutlined />
    </a>
  </Tooltip>;
}
