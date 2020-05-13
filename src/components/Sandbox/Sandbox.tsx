import styles from "./Sandbox.module.scss";
import Console from "./Console";
import { useAppData, useFS } from "../../store";
import { makeDoc } from "./makeDoc";
import { observer } from "mobx-react";
import path from "path";
import { useEffect, useRef } from "react";
import { autorun } from "mobx";
import emitter, { EVENT_TYPES } from "../../lib/event";

const Sandbox = observer(function Sandbox() {
  const fs = useFS();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const appData = useAppData();

  const url = path.join("/", appData.settings.entry) + "?sw";

  useEffect(() => {
    function triggerReload(e) {
      const { path } = e;
      // setTimeout(() => {
      //   iframeRef.current?.contentWindow?.location.reload();
      // }, 0);
      iframeRef.current?.contentWindow?.postMessage(
        { method: "PAGE_RELOAD", path },
        location.origin
      );
    }

    emitter.on(EVENT_TYPES.FILE_UPDATE, triggerReload);
    return () => {
      emitter.off(EVENT_TYPES.FILE_UPDATE, triggerReload);
    };
  }, []);

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
