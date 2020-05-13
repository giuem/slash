import { monaco as m } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";
import { emmetHTML, emmetCSS } from "emmet-monaco-es";
import emitter, { EVENT_TYPES } from "./event";
import localForage from "localforage";
import path from "path";
import { VFile } from "./fs";

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

function autoCompeteImport() {
  return monaco.languages.registerCompletionItemProvider("javascript", {
    triggerCharacters: ["'", '"', "/"],
    provideCompletionItems: async (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions: Monaco.languages.CompletionItem[] = [];

      if (
        /(([\s|\n]+from\s+)|(\bimport\s+))["|'][^'^"]*$/.test(textUntilPosition)
      ) {
        if (textUntilPosition.endsWith("/")) {
          const currentPath = model.uri.path;
          const dir = path.dirname(currentPath);
          const prefix = /(?:'|")(\S+)$/.exec(textUntilPosition)?.[1] ?? "";

          const foundPath = path.resolve(dir, prefix);

          const fs: { [key: string]: VFile } = await localForage.getItem("fs");
          if (fs) {
            const sgs: Monaco.languages.CompletionItem[] = Object.values(fs)
              .filter(f => f.path !== currentPath)
              .reduce<Monaco.languages.CompletionItem[]>((c, f) => {
                const d = path.dirname(f.path);
                const b = path.basename(f.path);
                if (d === foundPath && b) {
                  return c.concat({
                    label: b,
                    kind:
                      f.content == null
                        ? monaco.languages.CompletionItemKind.Folder
                        : monaco.languages.CompletionItemKind.File,
                    insertText: b,
                    range: range
                  });
                }
                return c;
              }, []);
            suggestions.push(...sgs);
          }
        } else {
          const deps: any = await localForage.getItem("dependencies");
          if (deps)
            suggestions.push(
              ...Object.keys(deps).map(name => ({
                label: name,
                kind: monaco.languages.CompletionItemKind.Module,
                detail: name,
                insertText: name,
                range: range
              }))
            );
        }
      }
      console.log(suggestions);
      return {
        suggestions
      };
    }
  });
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
  autoCompeteImport();

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
