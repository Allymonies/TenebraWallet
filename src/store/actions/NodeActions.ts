// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { createAction } from "typesafe-actions";
import {
  TenebraWorkDetailed, TenebraCurrency, TenebraConstants, TenebraMOTDBase,
  TenebraMOTDPackage
} from "@api/types";

import * as constants from "../constants";

export const setLastBlockID = createAction(constants.LAST_BLOCK_ID)<number>();
export const setLastTransactionID = createAction(constants.LAST_TRANSACTION_ID)<number>();
export const setLastNonMinedTransactionID = createAction(constants.LAST_NON_MINED_TRANSACTION_ID)<number>();
export const setLastOwnTransactionID = createAction(constants.LAST_OWN_TRANSACTION_ID)<number>();
export const setLastNameTransactionID = createAction(constants.LAST_NAME_TRANSACTION_ID)<number>();
export const setLastOwnNameTransactionID = createAction(constants.LAST_OWN_NAME_TRANSACTION_ID)<number>();

export const setSyncNode = createAction(constants.SYNC_NODE)<string>();
export const setDetailedWork = createAction(constants.DETAILED_WORK)<TenebraWorkDetailed>();
export const setPackage = createAction(constants.PACKAGE)<TenebraMOTDPackage>();
export const setCurrency = createAction(constants.CURRENCY)<TenebraCurrency>();
export const setConstants = createAction(constants.CONSTANTS)<TenebraConstants>();
export const setMOTD = createAction(constants.MOTD)<TenebraMOTDBase>();
