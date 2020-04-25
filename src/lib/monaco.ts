import { monaco as m } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";

export let monaco: typeof Monaco;

export const loadMonaco = () => {
  return m.init().then(m => {
    return (monaco = m);
  });
};
