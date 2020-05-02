// import { useToggle } from "./hooks";
import styles from "./Sidebar.module.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { Input } from "antd";

const Dependency = () => {
  // const [isFold, toggle] = useToggle(true);
  return (
    <section className={styles.Dependencies}>
      <header className={styles.SidebarHeader}>
        <span>Dependencies</span>
      </header>
      <section>
        <div className={styles.Item}>
          <span className={styles.ItemName}>
            reactreactreactreactreactreact
          </span>
          <span className={styles.ItemRight}>
            <span>16.0.0</span>
            <span className={styles.NpmDeleteIcon}>
              <DeleteOutlined />
            </span>
          </span>
        </div>
      </section>
      <footer>
        <div className={styles.EnterPkg}>
          <Input placeholder="enter package name" />
        </div>
      </footer>
    </section>
  );
};

export default Dependency;
