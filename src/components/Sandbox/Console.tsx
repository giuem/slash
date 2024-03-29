import { useConsole } from "./hooks";
import styles from "./Sandbox.module.scss";
import {
  CloseCircleFilled,
  StopOutlined,
  DownOutlined,
  UpOutlined
} from "@ant-design/icons";
import { useState, useCallback, useRef, useEffect } from "react";

const Console = () => {
  const { messages, clear } = useConsole();
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const toggleOpen = useCallback(() => {
    setOpen(v => !v);
  }, []);

  return (
    <div className={styles.Console}>
      <div className={styles.ConsoleBar}>
        <span className={styles.ConsoleBarTitle} onClick={toggleOpen}>
          Console
        </span>
        <span className={styles.ConsoleBarTools}>
          <span onClick={clear}>
            <StopOutlined />
          </span>
          <span onClick={toggleOpen}>
            {open ? <DownOutlined /> : <UpOutlined />}
          </span>
        </span>
      </div>
      <div
        className={styles.ConsoleContainer}
        style={{
          maxHeight: open ? "initial" : 0
        }}
        ref={listRef}
      >
        {messages.map(m => (
          <div className={styles.ConsoleContent} key={m.id} data-type={m.type}>
            {m.type === "error" && (
              <span className={styles.ConsoleContentIcon}>
                <CloseCircleFilled />
              </span>
            )}
            <span>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Console;
