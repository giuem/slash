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
  EditOutlined,
  FolderAddFilled,
  FileAddFilled
} from "@ant-design/icons";
import { Input, message } from "antd";

import VFile from "../lib/file";
// import VFileSystem from "../lib/fs";
import { useFS } from "../store/root";

import styles from "./Sidebar.module.scss";

const useAddFile = (p: string) => {
  const fs = useFS();
  const [type, setType] = useState<null | "file" | "dir">(null);

  const addFile = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setType("file");
  }, []);

  const addDir = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setType("dir");
  }, []);

  const addDone = useCallback(
    (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
      const val = (e.target as HTMLInputElement).value.trim();
      if (val) {
        try {
          if (val.indexOf("/") > 0 || val.indexOf("\\") > 0) {
            throw new Error("The title cannot contain slash or backslash");
          }
          if (val === "." || val === "..") {
            throw new Error("The title cannot be . or ..");
          }
          const filename = path.join(p, val);
          if (fs.exists(filename)) {
            throw new Error("The file exists!");
          }
          if (type === "dir") {
            fs.mkdirp(filename);
          } else {
            fs.writeFile(filename, "");
          }
        } catch (e) {
          message.error(e.message || "Fail to create");
        }
      }
      setType(null);
    },
    [fs, p, type]
  );

  return {
    type,
    addFile,
    addDir,
    addDone
  };
};

const TreeItem: React.FC<{ file: VFile; level: number }> = observer(
  function TreeItem({ file, level }) {
    const fs = useFS();
    const [isOpen, setOpen] = useState(false);
    const [isEdited, setEdited] = useState(false);
    const { type, addFile, addDir, addDone } = useAddFile(file.path);

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
          <Tree
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

const Tree: React.FC<{
  path: string;
  level?: number;
  addType: "dir" | "file";
  addDone: (e: any) => void;
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
        <TreeItem key={file.id} file={file} level={level} />
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

interface SidebarProps {
  width: number;
}

const Sidebar: React.FC<SidebarProps> = ({ width }) => {
  const { type, addFile, addDir, addDone } = useAddFile("/");
  return (
    <aside style={{ width }}>
      <section className={styles.Files}>
        <header>
          <span>Files</span>
          <span style={{ marginLeft: "auto" }}>
            <FileAddFilled onClick={addFile} />
            <FolderAddFilled style={{ marginLeft: 6 }} onClick={addDir} />
          </span>
        </header>
        <Tree path="/" addType={type} addDone={addDone} />
      </section>
    </aside>
  );
};

export default Sidebar;
