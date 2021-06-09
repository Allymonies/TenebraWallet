// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Dispatch, SetStateAction } from "react";

import * as api from "@api";
import { criticalError } from "@utils";

interface CheckNameResponse {
  available: boolean;
}

export async function checkName(
  name: string,
  setNameAvailable: Dispatch<SetStateAction<boolean | undefined>>
): Promise<void> {
  try {
    const url = `names/check/${encodeURIComponent(name)}`;
    const { available } = await api.get<CheckNameResponse>(url);
    setNameAvailable(available);
  } catch (err) {
    criticalError(err);
    setNameAvailable(undefined);
  }
}
