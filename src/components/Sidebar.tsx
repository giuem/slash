import VFile from "../lib/file";
// import VFileSystem from "../lib/fs";
import { useFS } from "../store/root";
import { observer } from "mobx-react";
import _ from "lodash";

const TreeItem: React.FC<{ file: VFile }> = observer(function TreeItem({
  file
}) {
  // console.log("treeitem", file.path);
  return (
    <li>
      <span>{file.basename}</span>
      {file.isDir && <Tree path={file.path} />}
    </li>
  );
});

const Tree: React.FC<{
  path: string;
}> = observer(function Tree({ path }) {
  const fs = useFS();
  const files = _.orderBy(
    fs.readdir(path),
    ["isDir", "basename"],
    ["desc", "asc"]
  );
  // console.log("tree", path);

  if (files.length === 0) return null;

  return (
    <ul>
      {files.map(file => (
        <TreeItem key={file.id} file={file} />
      ))}
    </ul>
  );
});

interface SidebarProps {
  width: number;
}

const Sidebar: React.FC<SidebarProps> = ({ width }) => {
  return (
    <aside style={{ width }}>
      <Tree path="/" />
    </aside>
  );
};

export default Sidebar;
