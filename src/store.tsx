import { useContext, createContext, useEffect, useState } from "react";
import { useLocalStore } from "mobx-react"; // 6.x
import VFileSystem, { fs } from "./lib/fs";
import TabStore, { tabStore } from "./lib/tabs";
import { autorun } from "mobx";
import * as Monaco from "monaco-editor";
import { loadMonaco } from "./lib/monaco";
import localforage from "localforage";
import PackageManager from "./lib/packageManager";
import AppData, { appData } from "./lib/app";

interface Store {
  fs: VFileSystem;
  tabStore: TabStore;
  monaco: typeof Monaco | null;
  packageManager: PackageManager;
  appData: AppData;
}

function createStore(): Store {
  return {
    fs,
    tabStore,
    monaco: null,
    packageManager: new PackageManager(),
    appData
  };
}

type TStore = ReturnType<typeof createStore>;

const storeContext = createContext<TStore | null>(null);

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(createStore);
  const [isLoading, setLoading] = useState(true);
  const { fs } = store;

  // debug only
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      window["Store"] = store;
      return () => {
        delete window["Store"];
      };
    }, [store]);
  }

  useEffect(() => {
    localforage.getItem("fs").then(o => {
      store.fs.fromJSON(o);
    });
  }, [store]);

  // sync fs to localforage
  useEffect(() => {
    return autorun(() => localforage.setItem("fs", fs.toJSON()), {
      delay: 300
    });
  }, [fs]);

  useEffect(() => {
    loadMonaco().then(m => {
      store.monaco = m;
      setLoading(false);
    });
  }, [store]);

  return (
    <storeContext.Provider value={store}>
      {isLoading ? null : children}
    </storeContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};

export const useFS = () => {
  const store = useStore();
  return store.fs;
};

export const useTabs = () => {
  const store = useStore();
  return store.tabStore;
};

export const useMonaco = () => {
  const store = useStore();
  return store.monaco!;
};

export const usePackageManager = () => {
  const store = useStore();
  return store.packageManager;
};

export const useAppData = () => {
  const store = useStore();
  return store.appData;
};
