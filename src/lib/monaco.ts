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

  const compilerDefaults = {
    jsxFactory: "React.createElement",
    reactNamespace: "React",
    jsx: monaco.languages.typescript.JsxEmit.React,
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    experimentalDecorators: true,
    noEmit: true,
    allowJs: true,
    typeRoots: ["node_modules/@types"]
  };

  monaco.languages.typescript.typescriptDefaults.setMaximumWorkerIdleTime(-1);
  monaco.languages.typescript.javascriptDefaults.setMaximumWorkerIdleTime(-1);
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
    compilerDefaults
  );
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
    compilerDefaults
  );

  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  });
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  });

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
