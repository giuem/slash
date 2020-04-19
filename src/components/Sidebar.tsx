import {
  useState,
  useCallback,
  MouseEvent,
  FocusEvent,
  KeyboardEvent
} from "react";
import { observer } from "mobx-react";
import path from "path";
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
import { Input } from "antd";

import VFile from "../lib/file";
// import VFileSystem from "../lib/fs";
import { useFS } from "../store/root";

import styles from "./Sidebar.module.scss";

const TreeItem: React.FC<{ file: VFile; level: number }> = observer(
  function TreeItem({ file, level }) {
    const fs = useFS();
    const [isOpen, setOpen] = useState(false);
    const [isEdited, setEdited] = useState(false);

    const toggleOpen = useCallback((e: MouseEvent) => {
      e.stopPropagation();
      setOpen(open => !open);
    }, []);

    const handleEdit = useCallback((e: MouseEvent) => {
      e.stopPropagation();
      setEdited(true);
    }, []);

    const handleEditDone = useCallback(
      (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
        const val = (e.target as HTMLInputElement).value.trim();
        if (val) {
          fs.rename(file.path, path.join(file.dirname, val));
        }
        setEdited(false);
      },
      [fs, file]
    );

    const handleDelete = useCallback(() => {
      fs.delete(file.path);
    }, [fs, file]);

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
          {isEdited ? (
            <Input
              size="middle"
              autoFocus
              spellCheck={false}
              defaultValue={file.basename}
              onBlur={handleEditDone}
              onPressEnter={handleEditDone}
            />
          ) : (
            <>
              <span>{file.basename}</span>
              <span className={styles.ToolBox}>
                {file.isDir && (
                  <>
                    <FolderAddOutlined />
                    <FileAddOutlined />
                  </>
                )}
                <EditOutlined onClick={handleEdit} />
                <CloseOutlined onClick={handleDelete} />
              </span>
            </>
          )}
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
