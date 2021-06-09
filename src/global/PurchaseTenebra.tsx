// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { useState, Dispatch, SetStateAction } from "react";
import { Modal, Row, Col, Button } from "antd";

import { useTFns } from "@utils/i18n";

import { TenebraValue } from "@comp/tenebra/TenebraValue";

import { GlobalHotKeys } from "react-hotkeys";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface PurchaseOption {
  image?: string;
  source: number;
  tenebra: number;
}

const VALUES: PurchaseOption[][] = [
  [
    { source: 5000, tenebra: 50 }, { source: 10000, tenebra: 100 },
    { source: 25000, tenebra: 250 }, { source: 50000, tenebra: 500 }
  ],
  [
    { source: 100000, tenebra: 1000 }, { source: 250000, tenebra: 2500 },
    { source: 500000, tenebra: 5000 }, { source: 500000000, tenebra: 5000000 }
  ]
];

export function PurchaseTenebra({
  visible,
  setVisible
}: Props): JSX.Element {
  const { t, tStr } = useTFns("purchaseTenebra.");

  return <Modal
    visible={visible}

    title={tStr("modalTitle")}
    width={750}

    footer={<Button onClick={() => setVisible(false)}>
      {t("dialog.close")}
    </Button>}
    onCancel={() => setVisible(false)}
  >
    {VALUES.map((row, i) => <Row key={i} gutter={8}>
      {row.map((option, i) => (
        <Col
          span={6}
          key={i}
          style={{ padding: 8, textAlign: "center" }}
        >
          <div style={{
            background: "#2a304a",
            borderRadius: 2,
            height: 128,
            padding: 16
          }}>
            <TenebraValue value={option.source} icon={"₩"} />
            <br /><br />
            <TenebraValue value={option.tenebra} long />
          </div>
        </Col>
      ))}
    </Row>)}
  </Modal>;
}

export function PurchaseTenebraHandler(): JSX.Element {
  const [visible, setVisible] = useState(false);

  return <>
    <PurchaseTenebra
      visible={visible}
      setVisible={setVisible}
    />

    <GlobalHotKeys
      keyMap={{ EPIC: ["up up down down left right left right b a enter"] }}
      handlers={{ EPIC: () => setVisible(true) }}
    />
  </>;
}
