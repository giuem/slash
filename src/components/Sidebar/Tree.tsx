import { useState, useCallback } from "react";
import { observer } from "mobx-react";
import {
  FolderFilled,
  FileFilled,
  FolderOpenFilled,
  FolderAddOutlined,
  FileAddOutlined,
  CloseOutlined,
  EditOutlined
} from "@ant-design/icons";
import _ from "lodash";
import { Input } from "antd";

import { useFS } from "../../store";
import { VFile } from "../../lib/fs";

import { useAddFileInPath, useEditFilename } from "./hooks";
import styles from "./Sidebar.module.scss";

const FileTreeItem: React.FC<{ file: VFile; level: number }> = observer(
  function TreeItem({ file, level }) {
    const fs = useFS();
    const [isOpen, setOpen] = useState(false);
    const { isEdited, handleEdit, handleEditDone } = useEditFilename(file);
    const { type, addFile, addDir, addDone } = useAddFileInPath(file.path);

    const toggleOpen = useCallback(() => {
      setOpen(open => !open);
    }, []);

    const handleDelete = useCallback(() => {
      fs.delete(file.path);
    }, [fs, file]);

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
              size="small"
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
  addType: "dir" | "file";
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
