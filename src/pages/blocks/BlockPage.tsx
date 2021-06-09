// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { useState, useEffect } from "react";
import { Row, Col, Skeleton, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import { PageLayout } from "@layout/PageLayout";
import { APIErrorResult } from "@comp/results/APIErrorResult";

import { Statistic } from "@comp/Statistic";
import { ContextualAddress } from "@comp/addresses/ContextualAddress";
import { BlockHash } from "./BlockHash";
import { TenebraValue } from "@comp/tenebra/TenebraValue";
import { DateTime } from "@comp/DateTime";
import { ConditionalLink } from "@comp/ConditionalLink";

import * as api from "@api";
import { TenebraBlock } from "@api/types";

import "./BlockPage.less";

interface ParamTypes {
  id: string;
}

function PageContents({ block }: { block: TenebraBlock }): JSX.Element {
  return <>
    <Row className="block-info-row">
      {/* Height */}
      <Col span={24} md={12} lg={8}>
        <Statistic titleKey="block.height" value={block.height.toLocaleString()}/>
      </Col>

      {/* Miner */}
      <Col span={24} md={12} lg={8}>
        <Statistic
          titleKey="block.miner"
          value={<ContextualAddress address={block.address} />}
        />
      </Col>

      {/* Value */}
      <Col span={24} md={12} lg={8}>
        <Statistic
          titleKey="block.value"
          value={<TenebraValue
            value={block.value}
            long
            green={block.value > 1}
          />}
        />
      </Col>

      {/* Time */}
      <Col span={24} md={12} lg={8}>
        <Statistic
          titleKey="block.time"
          value={<DateTime date={block.time} />}
        />
      </Col>

      {/* Difficulty */}
      <Col span={24} md={12} lg={8}>
        <Statistic
          titleKey="block.difficulty"
          value={block.difficulty.toLocaleString()}
        />
      </Col>

      {/* Hash */}
      <Col span={24}>
        <Statistic
          titleKey="block.hash"
          value={<BlockHash alwaysCopyable hash={block.hash} />}
          className="statistic-block-hash"
        />
      </Col>
    </Row>
  </>;
}

function NavButtons({ block }: { block?: TenebraBlock }): JSX.Element {
  const { t } = useTranslation();
  const lastBlockID = useSelector((s: RootState) => s.node.lastBlockID);

  // The Tenebra network's genesis block actually starts at ID 7 due to a
  // migration issue, so the hash is also checked here.
  const hasPrevious = block
    && block.height > 1
    && block.hash !== "0000000000000000000000000000000000000000000000000000000000000000";
  const previousID = hasPrevious ? block!.height - 1 : 0;
  const previousBtn = (
    <Button disabled={!hasPrevious} className="block-prev">
      <LeftOutlined />
      {t("block.previous")}
    </Button>
  );

  const hasNext = block && block.height < lastBlockID;
  const nextID = hasNext ? block!.height + 1 : 0;
  const nextBtn = (
    <Button
      className="block-next"
      type="primary"
      disabled={!hasNext}
    >
      {t("block.next")}
      <RightOutlined />
    </Button>
  );

  return <div className="block-nav-buttons">
    {/* Previous block button */}
    <ConditionalLink
      to={`/network/blocks/${encodeURIComponent(previousID)}`}
      condition={hasPrevious}
      replace
    >
      {previousBtn}
    </ConditionalLink>

    {/* Next block button */}
    <ConditionalLink
      to={`/network/blocks/${encodeURIComponent(nextID)}`}
      condition={hasNext}
      replace
    >
      {nextBtn}
    </ConditionalLink>
  </div>;
}

export function BlockPage(): JSX.Element {
  // Used to refresh the block data on syncNode change
  const syncNode = api.useSyncNode();
  const { t } = useTranslation();

  const { id } = useParams<ParamTypes>();
  const [tenebraBlock, setTenebraBlock] = useState<TenebraBlock | undefined>();
  const [error, setError] = useState<Error | undefined>();

  // Load the block on page load
  useEffect(() => {
    api.get<{ block: TenebraBlock }>("blocks/" + encodeURIComponent(id))
      .then(res => setTenebraBlock(res.block))
      .catch(err => { console.error(err); setError(err); });
  }, [syncNode, id]);

  // Change the page title depending on whether or not the block has loaded
  const titleData = tenebraBlock
    ? {
      siteTitle: t("block.siteTitleBlock", { id: tenebraBlock.height }),
      subTitle: t("block.subTitleBlock", { id: tenebraBlock.height })
    }
    : { siteTitleKey: "block.siteTitle" };

  return <PageLayout
    className="block-page"
    titleKey="block.title"
    {...titleData}
    extra={<NavButtons block={tenebraBlock} />}
  >
    {error
      ? (
        <APIErrorResult
          error={error}

          invalidParameterTitleKey="block.resultInvalidTitle"
          invalidParameterSubTitleKey="block.resultInvalid"

          notFoundMessage="block_not_found"
          notFoundTitleKey="block.resultNotFoundTitle"
          notFoundSubTitleKey="block.resultNotFound"
        />
      )
      : (tenebraBlock
        ? <PageContents block={tenebraBlock} />
        : <Skeleton active />)}
  </PageLayout>;
}
