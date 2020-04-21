import TabHeader from "./TabHeader";
import styles from "./EditorView.module.scss";
import HighEditor from "./Editor";

// https://github.com/suren-atoyan/monaco-react

const EditorView = () => {
  return (
    <div className={styles.EditorView}>
      <TabHeader />
      <HighEditor />
    </div>
  );
};

export default EditorView;
