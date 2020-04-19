import { useContext, createContext, useEffect, useLayoutEffect } from "react";
import { useLocalStore } from "mobx-react"; // 6.x
import VFileSystem from "../lib/fs";
import TabStore from "./tabs";
import { autorun } from "mobx";

function createStore() {
  return {
    fs: VFileSystem.fromJSON(localStorage.getItem("fs")),
    tabStore: new TabStore()
  };
}

type TStore = ReturnType<typeof createStore>;

const storeContext = createContext<TStore | null>(null);

// storeContext.displayName = "StoreContext";

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(createStore);
  const { fs } = store;

  useEffect(() => {
    const disposer = autorun(() => {
      localStorage.setItem("fs", fs.toJSON());
    });
    window["fs"] = fs;

    return () => {
      delete window["fs"];
      disposer();
    };
  }, [fs]);

  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
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
