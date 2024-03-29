import { useState, useCallback, MouseEvent } from "react";
import { observer } from "mobx-react";
import {
  FolderFilled,
  FileFilled,
  FolderOpenFilled,
  FolderAddOutlined,
  FileAddOutlined,
  CloseOutlined,
  EditOutlined,
  FolderAddFilled,
  FileAddFilled
} from "@ant-design/icons";
import _ from "lodash";
import { Input } from "antd";

import { useFS, useTabs } from "../../store";
import { VFile } from "../../lib/fs";

import { useAddFileInPath, useEditFilename } from "./hooks";
import styles from "./Sidebar.module.scss";

const FileTreeItem: React.FC<{ file: VFile; level: number }> = observer(
  function TreeItem({ file, level }) {
    const fs = useFS();
    const tabs = useTabs();
    const [isOpen, setOpen] = useState(false);
    const { isEdited, handleEdit, handleEditDone } = useEditFilename(file);
    const { type, addFile, addDir, addDone } = useAddFileInPath(file.path);

    const toggleOpen = useCallback(() => {
      setOpen(open => !open);
    }, []);

    const handleOpenFile = useCallback(() => {
      tabs.activateTab(file);
    }, [file, tabs]);

    const handleDelete = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        fs.delete(file.path);
      },
      [fs, file]
    );

    const handleAddFile = useCallback(
      e => {
        addFile(e);
        setOpen(true);
      },
      [addFile]
    );

    const handleAddDir = useCallback(
      e => {
        addDir(e);
        setOpen(true);
      },
      [addDir]
    );

    return (
      <>
        <div
          className={styles.Item}
          style={{ paddingLeft: `${level}rem` }}
          onClick={file.isDir ? toggleOpen : handleOpenFile}
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
              size="small"
              autoFocus
              spellCheck={false}
              defaultValue={file.basename}
              onBlur={handleEditDone}
              onPressEnter={handleEditDone}
            />
          ) : (
            <>
              <span className={styles.ItemName}>{file.basename}</span>
              <span className={styles.ToolBox}>
                {file.isDir && (
                  <>
                    <FileAddOutlined onClick={handleAddFile} />
                    <FolderAddOutlined onClick={handleAddDir} />
                  </>
                )}
                <EditOutlined onClick={handleEdit} />
                <CloseOutlined onClick={handleDelete} />
              </span>
            </>
          )}
        </div>
        {file.isDir && isOpen && (
          <FileTree
            path={file.path}
            level={level + 1}
            addType={type}
            addDone={addDone}
          />
        )}
      </>
    );
  }
);

export const FileTree: React.FC<{
  path: string;
  level?: number;
  addType: "dir" | "file" | null;
  addDone: ReturnType<typeof useAddFileInPath>["addDone"];
}> = observer(function Tree({ path, level = 1, addType, addDone }) {
  const fs = useFS();
  const files = _.orderBy(
    fs.readdir(path),
    ["isDir", "basename"],
    ["desc", "asc"]
  );

  return (
    <div className={styles.Tree}>
      {files.map(file => (
        <FileTreeItem key={file.id} file={file} level={level} />
      ))}
      {addType && (
        <div className={styles.Item} style={{ paddingLeft: `${level}rem` }}>
          <span className={styles.ItemIcon}>
            {addType === "dir" ? (
              <FolderFilled style={{ color: "#559cf3" }} />
            ) : (
              <FileFilled style={{ color: "#eee" }} />
            )}
          </span>
          <Input
            size="small"
            autoFocus
            spellCheck={false}
            onBlur={addDone}
            onPressEnter={addDone}
          />
        </div>
      )}
    </div>
  );
});

const Files = () => {
  const { type, addFile, addDir, addDone } = useAddFileInPath("/");
  return (
    <section className={styles.Files}>
      <header className={styles.SidebarHeader}>
        <span>Files</span>
        <span style={{ marginLeft: "auto" }}>
          <FileAddFilled onClick={addFile} />
          <FolderAddFilled style={{ marginLeft: 6 }} onClick={addDir} />
        </span>
      </header>
      <FileTree path="/" addType={type} addDone={addDone} />
    </section>
  );
};

export default Files;
