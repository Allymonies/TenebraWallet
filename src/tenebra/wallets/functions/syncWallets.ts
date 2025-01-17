// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { store } from "@app";
import * as actions from "@actions/WalletsActions";

import { TenebraAddressWithNames, lookupAddresses, lookupStakes } from "../../api/lookup";

import { Wallet, saveWallet } from "..";

import Debug from "debug";
import { TenebraStake } from "@api/types";
const debug = Debug("tenebraweb:sync-wallets");

function syncWalletProperties(
  wallet: Wallet,
  address: TenebraAddressWithNames | null,
  stake: TenebraStake | null,
  syncTime: Date
): Wallet {
  if (address) {
    return {
      ...wallet,
      ...(address.balance   !== undefined ? { balance: address.balance } : {}),
      ...(address.names     !== undefined ? { names: address.names } : {}),
      ...(address.firstseen !== undefined ? { firstSeen: address.firstseen } : {}),
      lastSynced: syncTime.toISOString(),
      stake: stake ? stake.stake : wallet.stake
    };
  } else {
    // Wallet was unsyncable (address not found), clear its properties
    return {
      ...wallet,
      balance: undefined,
      names: undefined,
      firstSeen: undefined,
      lastSynced: syncTime.toISOString()
    };
  }
}

function syncWalletStakeProperties(
  wallet: Wallet,
  stake: TenebraStake | null,
  syncTime: Date
): Wallet {
  return {
    ...wallet,
    lastSynced: syncTime.toISOString(),
    stake: stake ? stake.stake : wallet.stake
  };
}

/** Sync the data for a single wallet from the sync node, save it to local
 * storage, and dispatch the change to the Redux store. */
export async function syncWallet(
  wallet: Wallet,
  dontSave?: boolean
): Promise<void> {
  // Fetch the data from the sync node (e.g. balance)
  const { address } = wallet;
  const lookupResults = await lookupAddresses([address], true);
  const lookupStakeResults = await lookupStakes([address]);

  debug("synced individual wallet %s (%s): %o", wallet.id, wallet.address, lookupResults);

  const tenebraAddress = lookupResults[address];
  const tenebraStake = lookupStakeResults[address];
  syncWalletUpdate(wallet, tenebraAddress, tenebraStake, dontSave);
}

/** Given an already synced wallet, save it to local storage, and dispatch the
 * change to the Redux store. */
export function syncWalletUpdate(
  wallet: Wallet,
  address: TenebraAddressWithNames | null,
  stake?: TenebraStake | null,
  dontSave?: boolean
): void {
  const syncTime = new Date();
  const updatedWallet = syncWalletProperties(wallet, address, stake ?? null, syncTime);

  // Save the wallet to local storage, unless this was an external sync action
  if (!dontSave) saveWallet(updatedWallet);

  if (address) {
    // Wallet synced successfully, dispatch the change to the Redux store
    store.dispatch(actions.syncWallet(wallet.id, updatedWallet));
  } else {
    // Wallet failed to sync, clear its properties
    store.dispatch(actions.unsyncWallet(wallet.id, syncTime));
  }
}

/** Given an already synced wallet, save it to local storage, and dispatch the
 * change to the Redux store. */
export function syncWalletStakeUpdate(
  wallet: Wallet,
  stake?: TenebraStake | null,
  dontSave?: boolean
): void {
  const syncTime = new Date();
  const updatedWallet = syncWalletStakeProperties(wallet, stake ?? null, syncTime);

  // Save the wallet to local storage, unless this was an external sync action
  if (!dontSave) saveWallet(updatedWallet);
  console.log("New wallet ", updatedWallet);
  store.dispatch(actions.syncWallet(wallet.id, updatedWallet));
}

/** Sync the data for all the wallets from the sync node, save it to local
 * storage, and dispatch the changes to the Redux store. */
export async function syncWallets(): Promise<void> {
  const { wallets } = store.getState().wallets;

  const syncTime = new Date();

  // Fetch all the data from the sync node (e.g. balances)
  const addresses = Object.values(wallets).map(w => w.address);
  const lookupResults = await lookupAddresses(addresses, true);
  const lookupStakeResults = await lookupStakes(addresses);

  // Create a WalletMap with the updated wallet properties
  const updatedWallets = Object.entries(wallets).map(([_, wallet]) => {
    const tenebraAddress = lookupResults[wallet.address];
    if (!tenebraAddress) return wallet; // Skip unsyncable wallets
    const tenebraStake = lookupStakeResults[wallet.address];
    return syncWalletProperties(wallet, tenebraAddress, tenebraStake, syncTime);
  }).reduce((o, wallet) => ({ ...o, [wallet.id]: wallet }), {});

  // Save the wallets to local storage (unless dontSave is set)
  Object.values(updatedWallets).forEach(w => saveWallet(w as Wallet));

  // Dispatch the changes to the Redux store
  store.dispatch(actions.syncWallets(updatedWallets));
}
