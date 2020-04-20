import { VFile } from "./fs";

interface Tab {
  file: VFile;
  isEdited: boolean;
  isPined: boolean;
}

class TabStore {
  public tabs: Tab[];
  public activeTab: Tab;
}

export default TabStore;
