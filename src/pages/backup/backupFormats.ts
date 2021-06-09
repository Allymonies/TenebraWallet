// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { Wallet } from "@wallets";
import { Contact } from "@contacts";

// The values here are the translation keys for the formats.
export enum BackupFormatType {
  KRISTWEB_V1 = "import.detectedFormatTenebraWebV1",
  KRISTWEB_V2 = "import.detectedFormatTenebraWebV2"
}

export interface Backup {
  // This value is inserted by `detectBackupFormat`.
  type: BackupFormatType;

  salt: string;
  tester: string;
}

// =============================================================================
// TenebraWeb v1
// =============================================================================

// https://github.com/tmpim/TenebraWeb/blob/696a402/src/js/wallet/model.js
export interface TenebraWebV1Wallet {
  address?: string;
  label?: string;
  icon?: string;
  username?: string;
  password?: string;
  masterkey?: string;
  format?: string;
  syncNode?: string;
  balance?: number;
  position?: number;
}

// https://github.com/tmpim/TenebraWeb/blob/696a402/src/js/friends/model.js
export interface TenebraWebV1Contact {
  address?: string;
  label?: string;
  icon?: string;
  isName?: boolean;
  syncNode?: string;
}

export interface BackupTenebraWebV1 extends Backup {
  type: BackupFormatType.KRISTWEB_V1;

  // TenebraWeb v1 backups contain a map of wallets, where the values are
  // encrypted JSON.
  wallets: Record<string, string>;
  friends: Record<string, string>;
}
export const isBackupTenebraWebV1 = (backup: Backup): backup is BackupTenebraWebV1 =>
  backup.type === BackupFormatType.KRISTWEB_V1;

// =============================================================================
// TenebraWeb v2
// =============================================================================

export type TenebraWebV2Wallet = Wallet;
export type TenebraWebV2Contact = Contact;

export interface BackupTenebraWebV2 extends Backup {
  type: BackupFormatType.KRISTWEB_V2;
  version: 2;

  wallets: Record<string, TenebraWebV2Wallet>;
  contacts: Record<string, TenebraWebV2Contact>;
}
export const isBackupTenebraWebV2 = (backup: Backup): backup is BackupTenebraWebV2 =>
  backup.type === BackupFormatType.KRISTWEB_V2;
