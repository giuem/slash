import { monaco as m } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";
import { emmetHTML, emmetCSS } from "emmet-monaco-es";
import emitter, { EVENT_TYPES } from "./event";

export let monaco: typeof Monaco;

function listenPackageChange() {
  // emitter.on(EVENT_TYPES.ADD_PACKAGE, ({ name }) => {
  //   console.log(name)
  // });
  // emitter.on(EVENT_TYPES.REMOVE_PACKAGE, ({ name }) => {
  //   const libs = monaco.languages.typescript.typescriptDefaults.getExtraLibs();
  //   console.log(libs);
  // });
}

function onload() {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    schemas: [
      {
        uri: "https://schemastore.azurewebsites.net/schemas/json/package.json",
        fileMatch: ["package.json"]
      }
    ],
    validate: true,
    enableSchemaRequest: true
  });

  listenPackageChange();

  emmetHTML(monaco);
  emmetCSS(monaco);
}

export const loadMonaco = () => {
  return m.init().then(m => {
    monaco = m;
    onload();
    return monaco;
  });
};
