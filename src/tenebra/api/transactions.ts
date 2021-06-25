// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { TranslatedError } from "@utils/i18n";

import { TenebraStake, TenebraTransaction } from "./types";
import * as api from ".";

import { Wallet, decryptWallet } from "@wallets";

interface MakeTransactionResponse {
  transaction: TenebraTransaction;
}

interface StakingActionResponse {
  stake: TenebraStake;
}

export async function makeTransaction(
  masterPassword: string,
  from: Wallet,
  to: string,
  amount: number,
  metadata?: string
): Promise<TenebraTransaction> {
  // Attempt to decrypt the wallet to get the privatekey
  const decrypted = await decryptWallet(masterPassword, from);
  if (!decrypted)
    throw new TranslatedError("sendTransaction.errorWalletDecrypt");
  const { privatekey } = decrypted;

  const { transaction } = await api.post<MakeTransactionResponse>(
    "/transactions",
    {
      privatekey, to, amount,
      metadata: metadata || undefined // Clean up empty strings
    }
  );

  return transaction;
}

export async function makeDepositTransaction(
  masterPassword: string,
  from: Wallet,
  amount: number,
): Promise<TenebraStake> {
  // Attempt to decrypt the wallet to get the privatekey
  const decrypted = await decryptWallet(masterPassword, from);
  if (!decrypted)
    throw new TranslatedError("sendTransaction.errorWalletDecrypt");
  const { privatekey } = decrypted;

  const { stake } = await api.post<StakingActionResponse>(
    "/staking",
    {
      privatekey, amount
    }
  );

  return stake;
}


export async function makeWithdrawTransaction(
  masterPassword: string,
  from: Wallet,
  amount: number,
): Promise<TenebraStake> {
  // Attempt to decrypt the wallet to get the privatekey
  const decrypted = await decryptWallet(masterPassword, from);
  if (!decrypted)
    throw new TranslatedError("sendTransaction.errorWalletDecrypt");
  const { privatekey } = decrypted;

  const { stake } = await api.post<StakingActionResponse>(
    "/staking/withdraw",
    {
      privatekey, amount
    }
  );

  return stake;
}
