import styles from "./Sandbox.module.scss";
import Console from "./Console";
import { useAppData, useFS } from "../../store";
import { makeDoc } from "./makeDoc";
import { observer } from "mobx-react";
import path from "path";
import { useEffect, useRef } from "react";
import { autorun } from "mobx";

const Sandbox = observer(function Sandbox() {
  const fs = useFS();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const appData = useAppData();

  const url = path.join("/", appData.settings.entry) + "?sw";
  // const url = "https://baidu.com";

  // useEffect(() => {
  //   const dispose = autorun(
  //     () => {
  //       //@todo reload in need
  //       fs.toJSON();
  //       // iframeRef.current?.contentWindow?.postMessage(
  //       //   { method: "PAGE_RELOAD" },
  //       //   location.origin
  //       // );
  //       iframeRef.current?.contentWindow?.location.reload();
  //     },
  //     { delay: 3000 }
  //   );
  //   return dispose;
  // }, [fs]);

  // const entryFile = fs.stats(path.join("/", appData.settings.entry));
  // const doc = makeDoc(entryFile?.content ?? "");
  return (
    <div className={styles.Sandbox}>
      <div className={styles.iframe}>
        <iframe ref={iframeRef} src={url}></iframe>
      </div>
      <Console />
    </div>
  );
});

export default Sandbox;
