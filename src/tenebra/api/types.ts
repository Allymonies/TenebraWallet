// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
export interface TenebraAddress {
  address: string;

  balance: number;
  totalin?: number;
  totalout?: number;

  firstseen: string;
}

export type TenebraTransactionType = "unknown" | "mined" | "name_purchase"
  | "name_a_record" | "name_transfer" | "transfer" | "staking";
export interface TenebraTransaction {
  id: number;
  from: string | null;
  to: string;
  value: number;
  time: string;
  name?: string;
  metadata?: string;
  sent_name?: string;
  sent_metaname?: string;
  type: TenebraTransactionType;
}

export interface TenebraBlock {
  height: number;
  address: string;
  hash?: string | null;
  short_hash?: string | null;
  value: number;
  difficulty: number;
  time: string;
}

export interface TenebraName {
  name: string;
  owner: string;
  original_owner?: string;
  registered: string;
  updated?: string | null;
  a?: string | null;
  unpaid: number;
}

export interface TenebraWorkDetailed {
  work: number;
  unpaid: number;
  unpaidPenalties: number;

  base_value: number;
  block_value: number;

  decrease: {
    value: number;
    blocks: number;
    reset: number;
  };

  decreasePenalty: {
    value: number;
    blocks: number;
    reset: number;
  };
}

export interface TenebraConstants {
  wallet_version: number;
  nonce_max_size: number;
  name_cost: number;
  min_work: number;
  max_work: number;
  work_factor: number;
  seconds_per_block: number;
}
export const DEFAULT_CONSTANTS: TenebraConstants = {
  wallet_version: 16,
  nonce_max_size: 24,
  name_cost: 500,
  min_work: 100,
  max_work: 100000,
  work_factor: 0.025,
  seconds_per_block: 60
};

export interface TenebraCurrency {
  address_prefix: string;
  name_suffix: string;
  currency_name: string;
  currency_symbol: string;
}
export const DEFAULT_CURRENCY: TenebraCurrency = {
  address_prefix: "k", name_suffix: "kst",
  currency_name: "Tenebra", currency_symbol: "KST"
};

export interface TenebraMOTDBase {
  motd: string;
  motdSet: Date;

  miningEnabled: boolean;
  debugMode: boolean;
  endpoint?: string;
}
export const DEFAULT_MOTD_BASE: TenebraMOTDBase = {
  motd: "",
  motdSet: new Date(),
  miningEnabled: true,
  debugMode: false
};

export interface TenebraMOTD {
  motd: string;
  motd_set: string;

  public_url: string;
  mining_enabled: boolean;
  debug_mode: boolean;

  last_block?: TenebraBlock;
  package: TenebraMOTDPackage;
  constants: TenebraConstants;
  currency: TenebraCurrency;
}

export interface TenebraMOTDPackage {
  name: string;
  version: string;
  author: string;
  licence: string;
  repository: string;
}

export const DEFAULT_PACKAGE = {
  "name": "tenebra",
  "version": "0.0.0",
  "author": "Lemmmy",
  "licence": "GPL-3.0",
  "repository": "https://github.com/tmpim/Tenebra"
};

export type APIResponse<T extends Record<string, any>> = T & {
  ok: boolean;
  error?: string;
  parameter?: string;
}

export type WSConnectionState = "connected" | "disconnected" | "connecting";
export type WSSubscriptionLevel = "blocks" | "ownBlocks" | "transactions" | "ownTransactions" | "names" | "ownNames" | "motd";
export type WSEvent = "block" | "transaction" | "name" | "motd";
export interface WSIncomingMessage {
  id?: number;
  ok?: boolean;
  error?: string;
  type?: "keepalive" | "hello" | "event";

  event?: WSEvent;

  [key: string]: any;
}