import { useTabs, useAppData, useFS } from "../../store";
import { observer } from "mobx-react";
import {
  CloseOutlined,
  FileFilled,
  RightSquareOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  CloudDownloadOutlined
} from "@ant-design/icons";
import styles from "./TabHeader.module.scss";
import { useCallback, MouseEvent, useEffect } from "react";
import { TabItem } from "../../lib/tabs";
import { useFullscreen } from "@umijs/hooks";
import { Tooltip, message } from "antd";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Tab = observer(function Tab({ tab }: { tab: TabItem }) {
  const tabs = useTabs();

  const switchTab = useCallback(() => {
    tabs.activeTab = tab;
  }, [tabs, tab]);

  const closeTab = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      tabs.removeTab(tab);
    },
    [tab, tabs]
  );

  return (
    <div
      className={tab === tabs.activeTab ? styles.TabIsActive : styles.Tab}
      onClick={switchTab}
    >
      <span className={styles.TabIcon}>
        <FileFilled />
      </span>
      <span className={styles.TabName}>{tab.file.basename}</span>
      {/* <span className={styles.TabCloseIcon} onClick={closeTab}>
        <CloseOutlined />
      </span> */}
      {tab.isEdited ? (
        <span className={styles.TabUnSaveIcon} onClick={closeTab}></span>
      ) : (
        <span className={styles.TabCloseIcon} onClick={closeTab}>
          <CloseOutlined />
        </span>
      )}
    </div>
  );
});

const Toolbar = () => {
  const { isFullscreen, toggleFull } = useFullscreen({
    dom: document.documentElement
  });

  const fs = useFS();

  const appData = useAppData();

  const onDownload = useCallback(() => {
    const hide = message.loading("Generating Zip", 0);
    const zip = new JSZip();
    const files = Object.values(fs.toJSON());
    files.map(file => {
      const path = file.path.slice(1);
      const content = file.content;
      if (path && content != null) {
        if (content != null) {
          zip.file(path, file.content);
        } else if (content === null) {
          zip.folder(path);
        }
      }
    });
    zip
      .generateAsync({ type: "blob" })
      .then(function(content) {
        saveAs(content, "code.zip");
      })
      .finally(() => {
        hide();
      });
  }, []);
  return (
    <section className={styles.Toolbar}>
      <span onClick={onDownload}>
        <Tooltip title="Download">
          <CloudDownloadOutlined />
        </Tooltip>
      </span>
      <span onClick={toggleFull}>
        <Tooltip title="Fullscreen">
          {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </Tooltip>
      </span>
      <span onClick={appData.togglePreview}>
        <Tooltip title="Preview">
          <RightSquareOutlined />
        </Tooltip>
      </span>
    </section>
  );
};

const TabHeader = observer(function TabHeader() {
  const tabs = useTabs();

  return (
    <header className={styles.Header}>
      <section className={styles.Tabs}>
        {tabs.tabs.map(tab => (
          <Tab key={tab.id} tab={tab} />
        ))}
      </section>
      <Toolbar />
    </header>
  );
});

export default TabHeader;
