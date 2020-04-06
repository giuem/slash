import { AppProps } from "next/app";
import { monaco } from "@monaco-editor/react";

import "modern-normalize/modern-normalize.css";

monaco.config({
  paths: {
    vs: "/vs"
  }
});

export default function SlashApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
