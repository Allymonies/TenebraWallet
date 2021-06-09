// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Typography } from "antd";

import { useTranslation, Trans } from "react-i18next";

import { TenebraName } from "@api/types";
import { ContextualAddress } from "@comp/addresses/ContextualAddress";

const { Text } = Typography;

interface Props {
  name?: TenebraName;
}

export function NameHint({ name }: Props): JSX.Element {
  const { t } = useTranslation();

  return <span className="address-picker-hint address-picker-name-hint">
    {name
      ? (
        <Trans t={t} i18nKey="addressPicker.nameHint">
          Owner: <ContextualAddress address={name.owner} />
        </Trans>
      )
      : <Text type="danger">{t("addressPicker.nameHintNotFound")}</Text>}
  </span>;
}
