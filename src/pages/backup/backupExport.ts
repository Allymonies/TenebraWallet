// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { store } from "@app";

export async function backupExport(): Promise<string> {
  const { salt, tester } = store.getState().masterPassword;
  const { wallets } = store.getState().wallets;
  const { contacts } = store.getState().contacts;

  // Get the wallets, skipping those with dontSave set to true
  const finalWallets = Object.fromEntries(Object.entries(wallets)
    .filter(([_, w]) => w.dontSave !== true));

  const backup = {
    version: 2,

    // Store these to verify the master password is correct when importing
    salt, tester,

    wallets: finalWallets,
    contacts
  };

  // Convert to base64'd JSON
  const code = window.btoa(JSON.stringify(backup));
  return code;
}
