import { FolderAddFilled, FileAddFilled } from "@ant-design/icons";

import styles from "./Sidebar.module.scss";
import { useAddFileInPath } from "./hooks";
import { FileTree } from "./Tree";

interface SidebarProps {
  width: number | string;
}

const Sidebar: React.FC<SidebarProps> = ({ width }) => {
  const { type, addFile, addDir, addDone } = useAddFileInPath("/");
  return (
    <aside className={styles.Sidebar} style={{ width }}>
      <section className={styles.Files}>
        <header>
          <span>Files</span>
          <span style={{ marginLeft: "auto" }}>
            <FileAddFilled onClick={addFile} />
            <FolderAddFilled style={{ marginLeft: 6 }} onClick={addDir} />
          </span>
        </header>
        <FileTree path="/" addType={type} addDone={addDone} />
      </section>
    </aside>
  );
};

export default Sidebar;
