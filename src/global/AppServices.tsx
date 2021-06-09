// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { StorageBroadcast } from "./StorageBroadcast";
import { LegacyMigration } from "./legacy/LegacyMigration";
import { SyncWallets } from "@comp/wallets/SyncWallets";
import { ForcedAuth } from "./ForcedAuth";
import { WebsocketService } from "./ws/WebsocketService";
import { SyncMOTD } from "./ws/SyncMOTD";
import { AppHotkeys } from "./AppHotkeys";
import { PurchaseTenebraHandler } from "./PurchaseTenebra";
import { AdvanceTip } from "@pages/dashboard/TipsCard";

export function AppServices(): JSX.Element {
  return <>
    <StorageBroadcast />
    <LegacyMigration />
    <SyncWallets />
    <SyncMOTD />
    <ForcedAuth />
    <WebsocketService />
    <AppHotkeys />
    <PurchaseTenebraHandler />
    <AdvanceTip />
  </>;
}
