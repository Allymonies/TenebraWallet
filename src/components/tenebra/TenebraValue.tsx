// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import React from "react";
import classNames from "classnames";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import { TenebraSymbol } from "./TenebraSymbol";

import "./TenebraValue.less";

interface OwnProps {
  icon?: React.ReactNode;
  value?: number;
  long?: boolean;
  hideNullish?: boolean;
  green?: boolean;
  highlightZero?: boolean;
}
type Props = React.HTMLProps<HTMLSpanElement> & OwnProps;

export const TenebraValue = ({
  icon,
  value,
  long,
  hideNullish,
  green,
  highlightZero,
  ...props
}: Props): JSX.Element | null => {
  const currencySymbol = useSelector((s: RootState) => s.node.currency.currency_symbol);

  if (hideNullish && (value === undefined || value === null)) return null;

  const classes = classNames("tenebra-value", props.className, {
    "tenebra-value-green": green,
    "tenebra-value-zero": highlightZero && value === 0
  });

  return (
    <span {...props} className={classes}>
      {icon || ((currencySymbol || "TST") === "TST" && <TenebraSymbol />)}
      <span className="tenebra-value-amount">{(value || 0).toLocaleString()}</span>
      {long && <span className="tenebra-currency-long">{currencySymbol || "TST"}</span>}
    </span>
  );
};
