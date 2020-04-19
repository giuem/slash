import { AppProps } from "next/app";
import dynamic from "next/dynamic";

import { monaco } from "@monaco-editor/react";
import "mobx-react-lite/batchingForReactDom";
import "modern-normalize/modern-normalize.css";
import "../style/global.css";
import "antd/dist/antd.dark.css";

const StoreProviderNoSSR = dynamic(
  () => import("../store/root").then(c => c.StoreProvider),
  {
    ssr: false
  }
);

monaco.config({
  paths: {
    vs: "/vs"
  }
});

export default function SlashApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProviderNoSSR>
      <Component {...pageProps} />
    </StoreProviderNoSSR>
  );
}
