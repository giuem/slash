import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useCallback, useEffect, useState } from "react";
import { useTabs } from "../../store";
import { observer } from "mobx-react";

const options: editor.IEditorOptions = {
  minimap: { enabled: false }
};

const HighEditor = observer(function HighEditor() {
  const tabs = useTabs();
  // const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>();
  const handleEditorDidMount = useCallback((__, et) => {
    setEditor(et);
  }, []);

  useEffect(() => {
    if (editor && tabs.activeTab) {
      editor.setModel(tabs.activeTab.model);
    }
  }, [editor, tabs.activeTab]);

  return tabs.activeTab ? (
    <Editor
      height="100%"
      theme="dark"
      options={options}
      editorDidMount={handleEditorDidMount}
    />
  ) : null;
});

export default HighEditor;
