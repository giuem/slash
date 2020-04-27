import { useTabs } from "../../store";
import { observer } from "mobx-react";
import {
  CloseOutlined,
  FileFilled,
  RightSquareOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined
} from "@ant-design/icons";
import styles from "./TabHeader.module.scss";
import { useCallback, MouseEvent, useEffect } from "react";
import { TabItem } from "../../lib/tabs";
import { useFullscreen } from "@umijs/hooks";
import { Tooltip } from "antd";

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
      <span className={styles.TabCloseIcon} onClick={closeTab}>
        <CloseOutlined />
      </span>
      {/* {tab.isEdited ? (
        <span className={styles.TabUnSaveIcon} onClick={closeTab}></span>
      ) : (
        <span className={styles.TabCloseIcon} onClick={closeTab}>
          <CloseOutlined />
        </span>
      )} */}
    </div>
  );
});

const Toolbar = () => {
  const { isFullscreen, toggleFull } = useFullscreen({
    dom: document.documentElement
  });

  return (
    <section className={styles.Toolbar}>
      <span onClick={toggleFull}>
        <Tooltip title="Fullscreen">
          {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </Tooltip>
      </span>
      <span>
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
