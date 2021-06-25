// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { TranslatedError } from "@utils/i18n";

import { APIError } from "@api";
import { ShowAuthFailedFn } from "@api/AuthFailed";

import { Wallet } from "@wallets";

export function handleStakingError(
  onError: ((error: Error) => void) | undefined,
  showAuthFailed: ShowAuthFailedFn,
  err: Error,
  from?: Wallet
): void {
  // Construct a TranslatedError pre-keyed to sendTransaction
  const tErr = (key: string) => new TranslatedError("staking." + key);

  switch (err.message) {
  case "missing_parameter":
  case "invalid_parameter":
    switch ((err as APIError).parameter) {
    case "privatekey":
      return onError?.(tErr("errorParameterPrivatekey"));
    case "amount":
      return onError?.(tErr("errorParameterAmount"));
    }
    break;
  case "insufficient_funds":
    return onError?.(tErr("errorInsufficientFunds"));
  case "auth_failed":
    return showAuthFailed(from!);
  }

  // Pass through any other unknown errors
  onError?.(err);
}
