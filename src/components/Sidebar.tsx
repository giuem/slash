import VFile from "../lib/file";

interface SidebarProps {
  files: VFile[];
}

interface ItemProps {
  file: VFile;
}

const Item: React.FC<ItemProps> = ({ file }) => {
  return <div>{file.basename}</div>;
};

const Sidebar: React.FC<SidebarProps> = ({ files }) => {
  return (
    <aside>
      {files.map(file => (
        <Item key={file.path} file={file} />
      ))}
    </aside>
  );
};

export default Sidebar;
