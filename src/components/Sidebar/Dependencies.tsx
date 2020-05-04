// import { useToggle } from "./hooks";
import styles from "./Sidebar.module.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { Input, message } from "antd";
import { usePackageManager } from "../../store";
import { observer } from "mobx-react";
import { useCallback, useState, ChangeEvent } from "react";

const Item = ({ item, onDeleted }) => {
  const handleDelete = useCallback(() => {
    onDeleted && onDeleted(item);
  }, [item, onDeleted]);

  return (
    <div className={styles.Item} key={item.name}>
      <span className={styles.ItemName}>{item.name}</span>
      <span className={styles.ItemRight}>
        <span>{item.version}</span>
        <span className={styles.NpmDeleteIcon} onClick={handleDelete}>
          <DeleteOutlined />
        </span>
      </span>
    </div>
  );
};

const Dependency = observer(() => {
  const manager = usePackageManager();
  const [val, setVal] = useState("");

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  }, []);

  const handleAddPackage = useCallback(() => {
    if (val) {
      const hide = message.loading("Installing Dependency", 0);
      manager
        .addPackage(val)
        .then(() => {
          message.success("Successfully Installed");
          setVal("");
        })
        .catch(() => {
          message.error("Failed to Installed");
        })
        .finally(hide);
    }
  }, [manager, val]);

  const handleDeletePackage = useCallback(
    item => {
      manager.removePackage(item.name);
    },
    [manager]
  );
  return (
    <section className={styles.Dependencies}>
      <header className={styles.SidebarHeader}>
        <span>Dependencies</span>
      </header>
      <section>
        {manager.dependencies.map(item => (
          <Item key={item.name} item={item} onDeleted={handleDeletePackage} />
        ))}
      </section>
      <footer>
        <div className={styles.EnterPkg}>
          <Input
            placeholder="enter package name"
            value={val}
            onChange={handleInputChange}
            onPressEnter={handleAddPackage}
          />
        </div>
      </footer>
    </section>
  );
});

export default Dependency;
