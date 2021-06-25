// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { useMemo } from "react";

import { useTFns } from "@utils/i18n";

import { useLocation } from "react-router-dom";
import { message } from "antd";

interface Res {
  amount?: number;
}

export function useStakingQuery(): Res {
  const { tStr } = useTFns("staking.");
  const search = useLocation().search;
  // Memoise the query parsing, as notifications are triggered directly here. To
  // avoid spamming them, this should only run once per query string.
  return useMemo(() => {
    const query = new URLSearchParams(search);

    // Fetch the form parameters from the query string
    const rawAmount = query.get("amount")?.trim();

    const parsedAmount = rawAmount ? parseInt(rawAmount) : undefined;
    const amountValid = rawAmount && !isNaN(parsedAmount!) && parsedAmount! > 0;

    // Show a notification if any parameter is invalid
    if (rawAmount && !amountValid) {
      message.error(tStr("errorInvalidQuery"));
      return {};
    }

    // The parameters were valid (or non-existent), return them
    return {
      amount: parsedAmount,
    };
  }, [tStr, search]);
}
