// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from "react-redux";
import { initStore } from "./store/init";

// Set up localisation
import "./utils/i18n";

// FIXME: Apparently the import order of my CSS is important. Who knew!
import "./App.less";

import createWorker from "workerize-loader?name=kw-storage-worker.[contenthash:8]!./workers/Storage.worker";
import * as StorageWorker from "./workers/Storage.worker";

import { AppLoading } from "./global/AppLoading";
import { CheckStatus } from "./pages/CheckStatus";
import { AppServices } from "./global/AppServices";
import { WebsocketProvider } from "./global/ws/WebsocketProvider";
import { LocaleContext } from "./global/LocaleContext";

import Debug from "debug";
const debug = Debug("kristweb:app");

export let store: ReturnType<typeof initStore>;

function App(): JSX.Element {
  debug("whole app is being rendered!");

  if (!store) {
    debug("initialising redux store");
    store = initStore();
  }

  const worker = createWorker<typeof StorageWorker>();
  console.log(worker);
  worker.foo("test")
    .then((s: string) => debug("worker said: %s", s));

  return <Suspense fallback={<AppLoading />}>
    <Provider store={store}>
      <LocaleContext>
        <WebsocketProvider>
          <Router>
            <CheckStatus />

            {/* Services, etc. */}
            <AppServices />
          </Router>
        </WebsocketProvider>
      </LocaleContext>
    </Provider>
  </Suspense>;
}

export default App;
