import { AppProps } from "next/app";
import { monaco } from "@monaco-editor/react";
import "mobx-react-lite/batchingForReactDom";
import "modern-normalize/modern-normalize.css";
import "../style/global.css";
import "antd/dist/antd.dark.css";

import { StoreProvider } from "../store/root";

monaco.config({
  paths: {
    vs: "/vs"
  }
});

export default function SlashApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}
