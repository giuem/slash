import styles from "./Sidebar.module.scss";
import Files from "./Files";
import Dependency from "./Dependencies";

interface SidebarProps {
  width: number | string;
}

const Sidebar: React.FC<SidebarProps> = ({ width }) => {
  return (
    <aside className={styles.Sidebar} style={{ width }}>
      <Files />
      <Dependency />
    </aside>
  );
};

export default Sidebar;
