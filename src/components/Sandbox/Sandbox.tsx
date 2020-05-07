import styles from "./Sandbox.module.scss";
import Console from "./Console";
import { useFS, useAppData } from "../../store";
import { makeDoc } from "./makeDoc";
import { observer } from "mobx-react";
import path from "path";

const Sandbox = observer(function Sandbox() {
  const fs = useFS();
  const appData = useAppData();

  const entryFile = fs.stats(path.join("/", appData.settings.entry));
  const doc = makeDoc(entryFile?.content ?? "");
  return (
    <div className={styles.Sandbox}>
      <div className={styles.iframe}>
        <iframe srcDoc={doc}></iframe>
      </div>
      <Console />
    </div>
  );
});

export default Sandbox;
