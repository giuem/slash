import {
  useCallback,
  useState,
  FocusEvent,
  KeyboardEvent,
  MouseEvent
} from "react";
import { useFS } from "../../store";
import path from "path";
import { message } from "antd";
import { VFile } from "../../lib/fs";

export const useEditFilename = (file: VFile) => {
  const fs = useFS();
  const [isEdited, setEdited] = useState(false);

  const handleEdit = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setEdited(true);
  }, []);

  const handleEditDone = useCallback(
    (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
      const val = (e.target as HTMLInputElement).value.trim();
      if (val) {
        try {
          if (val.indexOf("/") > -1 || val.indexOf("\\") > -1) {
            throw new Error("The title cannot contain slash or backslash");
          }
          if (val === "." || val === "..") {
            throw new Error("The title cannot be . or ..");
          }
          const filename = path.join(file.path, val);
          if (fs.exists(filename)) {
            throw new Error("The file exists!");
          }

          fs.rename(file.path, path.join(file.dirname, val));
        } catch (e) {
          message.error(e.message || "Fail to rename");
        }
      }
      setEdited(false);
    },
    [fs, file]
  );

  return {
    isEdited,
    handleEdit,
    handleEditDone
  };
};

export const useAddFileInPath = (p: string) => {
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
          if (val.indexOf("/") > -1 || val.indexOf("\\") > -1) {
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

export const useToggle = (defaultValue: boolean) => {
  const [v, sv] = useState(defaultValue);
  const tg = useCallback(() => {
    sv(v => !v);
  }, []);

  return [v, tg];
};
