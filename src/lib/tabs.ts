import { VFile } from "./fs";
import { editor } from "monaco-editor";
import { observable, action } from "mobx";
import _ from "lodash";
import { monaco } from "./monaco";

// export interface TabItem {
//   id: string;
//   file: VFile;
//   model: editor.ITextModel;
//   isEdited: boolean;
//   isPined: boolean;
// }

export class TabItem {
  public id = _.uniqueId();
  public readonly file: VFile;
  public readonly model: editor.ITextModel;

  // @observable
  // public isEdited = false;

  constructor(file: VFile) {
    this.file = file;
    const uri = monaco.Uri.from({ path: file.path, scheme: "file" });
    this.model =
      monaco.editor.getModel(uri) ||
      monaco.editor.createModel(
        file.content as string,
        "",
        monaco.Uri.from({ path: file.path, scheme: "file" })
      );

    this.model.onDidChangeContent(e => {
      const content = this.model.getValue();
      this.file.content = content;
    });
  }

  // save() {
  //   const content = this.model.getValue();
  //   this.file.content = content;
  // }

  dispose() {
    this.model.dispose();
  }
}

class TabStore {
  @observable.shallow
  public tabs: Array<TabItem> = [];

  @observable
  public activeTab: TabItem | null;

  @action
  public async activateTab(file: VFile) {
    let tab = this.tabs.find(t => t.file === file);
    if (!tab) {
      tab = new TabItem(file);
      this.tabs.push(tab);
    }

    this.activeTab = tab;

    return tab;
  }

  @action
  public removeTab(tab: TabItem) {
    tab.dispose();
    const idx = this.tabs.findIndex(t => t === tab);
    this.tabs = this.tabs.filter(t => t !== tab);

    if (this.activeTab === tab) {
      this.activeTab =
        this.tabs[idx < this.tabs.length ? idx : idx - 1] ?? null;
    }
  }
}

export default TabStore;
