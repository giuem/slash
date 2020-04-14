import RcTabs, { TabPane } from "rc-tabs";

const Tabs: React.FC = ({ children }) => {
  return <RcTabs>{children}</RcTabs>;
};

export { TabPane };

export default Tabs;
