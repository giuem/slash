import { VFile } from "./fs";
import { editor } from "monaco-editor";
import { observable, action } from "mobx";
import { monaco } from "@monaco-editor/react";
import _ from "lodash";

export interface TabItem {
  id: string;
  file: VFile;
  model: editor.ITextModel;
  isEdited: boolean;
  isPined: boolean;
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
      const m = await monaco.init().then(m => m);
      // console.log(editor);
      tab = observable({
        id: _.uniqueId(),
        file,
        model: m.editor.createModel(
          file.content as string,
          "",
          m.Uri.from({ path: file.path, scheme: "file" })
        ),
        isEdited: false,
        isPined: false
      });

      tab.model.onDidChangeContent(e => {
        tab!.isEdited = true;
      });

      this.tabs.push(tab);
    }

    this.activeTab = tab;

    return tab;
  }

  @action
  public removeTab(tab: TabItem) {
    tab.model.dispose();
    const idx = this.tabs.findIndex(t => t === tab);
    this.tabs = this.tabs.filter(t => t !== tab);

    if (this.activeTab === tab) {
      this.activeTab =
        this.tabs[idx < this.tabs.length ? idx : idx - 1] ?? null;
    }
  }
}

export default TabStore;
