import VFile from "../lib/file";
// import VFileSystem from "../lib/fs";
import { useFS } from "../store/root";
import { observer } from "mobx-react";
import _ from "lodash";
import {
  FolderFilled,
  FileFilled,
  FolderOpenFilled,
  FolderAddOutlined,
  FileAddOutlined,
  CloseOutlined,
  EditOutlined
} from "@ant-design/icons";

import styles from "./Sidebar.module.scss";
import { useState, useCallback, MouseEvent } from "react";

const ToolBox: React.FC<{ file: VFile }> = ({ file }) => {
  const fs = useFS();
  const handleDelete = useCallback(() => {
    fs.delete(file.path);
  }, [fs, file]);

  return (
    <span className={styles.ToolBox}>
      {file.isDir && (
        <>
          <FolderAddOutlined />
          <FileAddOutlined />
        </>
      )}

      <EditOutlined />
      <CloseOutlined onClick={handleDelete} />
    </span>
  );
};

const TreeItem: React.FC<{ file: VFile; level: number }> = observer(
  function TreeItem({ file, level }) {
    const [isOpen, setOpen] = useState(false);

    const toggleOpen = useCallback((e: MouseEvent) => {
      e.stopPropagation();
      setOpen(open => !open);
    }, []);

    return (
      <>
        <div
          className={styles.Item}
          style={{ paddingLeft: `${level}rem` }}
          onClick={toggleOpen}
        >
          <span className={styles.ItemIcon}>
            {file.isDir ? (
              isOpen ? (
                <FolderOpenFilled style={{ color: "#559cf3" }} />
              ) : (
                <FolderFilled style={{ color: "#559cf3" }} />
              )
            ) : (
              <FileFilled style={{ color: "#eee" }} />
            )}
          </span>
          <span>{file.basename}</span>
          <ToolBox file={file} />
        </div>
        {file.isDir && isOpen && <Tree path={file.path} level={level + 1} />}
      </>
    );
  }
);

const Tree: React.FC<{
  path: string;
  level?: number;
}> = observer(function Tree({ path, level = 1 }) {
  const fs = useFS();
  const files = _.orderBy(
    fs.readdir(path),
    ["isDir", "basename"],
    ["desc", "asc"]
  );
  // console.log("tree", path);

  if (files.length === 0) return null;

  return (
    <div className={styles.Tree}>
      {files.map(file => (
        <TreeItem key={file.id} file={file} level={level} />
      ))}
    </div>
  );
});

interface SidebarProps {
  width: number;
}

const Sidebar: React.FC<SidebarProps> = ({ width }) => {
  return (
    <aside style={{ width }}>
      <section className={styles.Files}>
        <header>Files</header>
        <Tree path="/" />
      </section>
    </aside>
  );
};

export default Sidebar;
