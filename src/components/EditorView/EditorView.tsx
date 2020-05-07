import TabHeader from "./TabHeader";
import styles from "./EditorView.module.scss";
import HighEditor from "./Editor";
import { useTabs, useAppData } from "../../store";
import { observer } from "mobx-react";
import SplitPane from "react-split-pane";
import Sandbox from "../Sandbox/Sandbox";
import { useMemo } from "react";

// https://github.com/suren-atoyan/monaco-react

const EditorView = observer(() => {
  const tab = useTabs();
  const appData = useAppData();
  const editorEl = useMemo(() => <HighEditor />, []);
  return (
    <div className={styles.EditorView}>
      {tab.activeTab && (
        <>
          <TabHeader />
          {appData.settings.showPreview ? (
            <SplitPane
              style={{ top: 39, bottom: 0, height: "auto" }}
              minSize={300}
              defaultSize="50%"
            >
              {editorEl}
              <Sandbox />
            </SplitPane>
          ) : (
            <div
              style={{
                top: 39,
                bottom: 0,
                position: "absolute",
                left: 0,
                right: 0
              }}
            >
              {editorEl}
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default EditorView;
