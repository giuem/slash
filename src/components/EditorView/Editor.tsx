import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useCallback, useEffect, useState } from "react";
import { useTabs } from "../../store";
import { observer } from "mobx-react";
import { useSize } from "@umijs/hooks";

const options: editor.IEditorOptions = {
  minimap: { enabled: false },
  fontFamily: "'Fira Code', Courier, monospace",
  fontSize: 14
  // automaticLayout: true
};

const HighEditor = observer(function HighEditor() {
  const tabs = useTabs();
  const [state, ref] = useSize<HTMLDivElement>();
  // const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>();
  const handleEditorDidMount = useCallback((__, et) => {
    setEditor(et);
  }, []);

  useEffect(() => {
    const at = tabs.activeTab;
    if (editor && at) {
      editor.setModel(at.model);
      if (at.state) {
        editor.restoreViewState(at.state);
        editor.focus();
      }
    }
    return () => {
      if (editor && at) {
        at.state = editor.saveViewState();
      }
    };
  }, [editor, tabs.activeTab]);

  useEffect(() => {
    editor?.layout();
  }, [editor, state]);

  return (
    <div
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      ref={ref}
    >
      <Editor
        theme="dark"
        options={options}
        editorDidMount={handleEditorDidMount}
      />
    </div>
  );
});

export default HighEditor;
