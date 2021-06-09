// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of TenebraWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/TenebraWeb2/blob/master/LICENSE.txt
import { FC, createContext, useState, Dispatch, SetStateAction } from "react";

import { WebsocketConnection } from "./WebsocketConnection";

import Debug from "debug";
const debug = Debug("tenebraweb:websocket-provider");

export interface WSContextType {
  connection?: WebsocketConnection;
  setConnection?: Dispatch<SetStateAction<WebsocketConnection | undefined>>;
}
export const WebsocketContext = createContext<WSContextType>({});

export const WebsocketProvider: FC = ({ children }): JSX.Element => {
  const [connection, setConnection] = useState<WebsocketConnection | undefined>();

  debug("ws provider re-rendering");

  return <WebsocketContext.Provider value={{ connection, setConnection }}>
    {children}
  </WebsocketContext.Provider>;
};
