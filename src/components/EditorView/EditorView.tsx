import TabHeader from "./TabHeader";
import styles from "./EditorView.module.scss";
import HighEditor from "./Editor";
import { useTabs } from "../../store";
import { observer } from "mobx-react";

// https://github.com/suren-atoyan/monaco-react

const EditorView = observer(() => {
  const tab = useTabs();
  return (
    <div className={styles.EditorView}>
      {tab.activeTab && (
        <>
          <TabHeader />
          <HighEditor />
        </>
      )}
    </div>
  );
});

export default EditorView;
