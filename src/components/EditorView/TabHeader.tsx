import { useTabs } from "../../store";
import { observer } from "mobx-react";
import { CloseOutlined, FileFilled } from "@ant-design/icons";
import styles from "./TabHeader.module.scss";
import { useCallback, MouseEvent } from "react";

const TabItem = observer(function TabItem({ tab }) {
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
    </div>
  );
});

const TabHeader = observer(function TabHeader() {
  const tabs = useTabs();

  return (
    <header className={styles.Header}>
      <section className={styles.Tabs}>
        {tabs.tabs.map(tab => (
          <TabItem key={tab.id} tab={tab} />
        ))}
      </section>
    </header>
  );
});

export default TabHeader;
