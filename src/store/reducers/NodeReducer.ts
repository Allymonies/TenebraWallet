// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { createReducer } from "typesafe-actions";
import {
  TenebraWorkDetailed,
  TenebraCurrency, DEFAULT_CURRENCY,
  TenebraConstants, DEFAULT_CONSTANTS,
  TenebraMOTDBase, DEFAULT_MOTD_BASE,
  TenebraMOTDPackage, DEFAULT_PACKAGE
} from "@api/types";
import {
  setLastBlockID, setLastTransactionID, setLastNonMinedTransactionID,
  setLastOwnTransactionID, setLastNameTransactionID, setLastOwnNameTransactionID,
  setSyncNode, setDetailedWork, setPackage, setCurrency, setConstants, setMOTD
} from "@actions/NodeActions";

import packageJson from "../../../package.json";

export interface State {
  // Used to handle auto-refreshing of various pages
  readonly lastBlockID: number;
  readonly lastTransactionID: number;
  readonly lastNonMinedTransactionID: number;
  readonly lastOwnTransactionID: number;
  readonly lastNameTransactionID: number;
  readonly lastOwnNameTransactionID: number;

    // Info from the MOTD
  readonly syncNode: string;
  readonly detailedWork?: TenebraWorkDetailed;
  readonly package: TenebraMOTDPackage;
  readonly currency: TenebraCurrency;
  readonly constants: TenebraConstants;
  readonly motd: TenebraMOTDBase;
}

export function getInitialNodeState(): State {
  return {
    // Used to handle auto-refreshing of various pages
    lastBlockID: 0,
    lastTransactionID: 0,
    lastNonMinedTransactionID: 0,
    lastOwnTransactionID: 0,
    lastNameTransactionID: 0,
    lastOwnNameTransactionID: 0,

    // Info from the MOTD
    syncNode: localStorage.getItem("syncNode") || packageJson.defaultSyncNode,
    package: DEFAULT_PACKAGE,
    currency: DEFAULT_CURRENCY,
    constants: DEFAULT_CONSTANTS,
    motd: DEFAULT_MOTD_BASE
  };
}

export const NodeReducer = createReducer({} as State)
  // Used to handle auto-refreshing of various pages
  .handleAction(setLastBlockID, (state, action) => ({ ...state, lastBlockID: action.payload }))
  .handleAction(setLastTransactionID, (state, action) => ({ ...state, lastTransactionID: action.payload }))
  .handleAction(setLastNonMinedTransactionID, (state, action) => ({ ...state, lastNonMinedTransactionID: action.payload }))
  .handleAction(setLastOwnTransactionID, (state, action) => ({ ...state, lastOwnTransactionID: action.payload }))
  .handleAction(setLastNameTransactionID, (state, action) => ({ ...state, lastNameTransactionID: action.payload }))
  .handleAction(setLastOwnNameTransactionID, (state, action) => ({ ...state, lastOwnNameTransactionID: action.payload }))

  // Info from the MOTD
  .handleAction(setSyncNode, (state, action) => ({ ...state, syncNode: action.payload }))
  .handleAction(setDetailedWork, (state, action) => ({ ...state, detailedWork: action.payload }))
  .handleAction(setPackage, (state, action) => ({ ...state, package: action.payload }))
  .handleAction(setCurrency, (state, action) => ({ ...state, currency: action.payload }))
  .handleAction(setConstants, (state, action) => ({ ...state, constants: action.payload }))
  .handleAction(setMOTD, (state, action) => ({ ...state, motd: action.payload }));
