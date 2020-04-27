import { monaco as m } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";

function onload(monaco: typeof Monaco) {
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
}

export let monaco: typeof Monaco;

export const loadMonaco = () => {
  return m.init().then(m => {
    onload(m);
    return (monaco = m);
  });
};
