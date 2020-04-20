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

export const useAddFile = (p: string) => {
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
