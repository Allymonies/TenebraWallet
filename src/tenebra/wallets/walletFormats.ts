// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { sha256 } from "@utils/crypto";

export interface WalletFormat {
  (password: string, username?: string): Promise<string>;
}

export type WalletFormatName = "tenebrawallet" | "tenebrawallet_username_appendhashes" | "tenebrawallet_username" | "jwalelset" | "api";
export const WALLET_FORMATS: Record<WalletFormatName, WalletFormat> = {
  "tenebrawallet": async password =>
    await sha256("KRISTWALLET" + password) + "-000",

  "tenebrawallet_username_appendhashes": async (password, username) =>
    await sha256("KRISTWALLETEXTENSION" + await sha256(await sha256(username || "") + "^" + await sha256(password))) + "-000",

  "tenebrawallet_username": async (password, username) =>
    await sha256(await sha256(username || "") + "^" + await sha256(password)),

  "jwalelset": async password =>
    await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(password)))))))))))))))))),

  "api": async password => password
};
export const ADVANCED_FORMATS: WalletFormatName[] = [
  "tenebrawallet_username_appendhashes", "tenebrawallet_username", "jwalelset"
];

export const applyWalletFormat =
  (format: WalletFormatName, password: string, username?: string): Promise<string> =>
    WALLET_FORMATS[format](password, username);

export const formatNeedsUsername = (format: WalletFormatName): boolean =>
  WALLET_FORMATS[format].length === 2;
