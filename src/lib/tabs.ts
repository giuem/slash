import { VFile } from "./fs";
import { editor } from "monaco-editor";
import { observable, action } from "mobx";
import { monaco } from "@monaco-editor/react";
import _ from "lodash";

interface Tab {
  id: string;
  file: VFile;
  model: editor.ITextModel;
  isEdited: boolean;
  isPined: boolean;
}

class TabStore {
  @observable.shallow
  public tabs: Array<Tab> = [];

  @observable
  public activeTab: Tab | null;

  @action
  public async activateTab(file: VFile) {
    let tab = this.tabs.find(t => t.file === file);
    if (!tab) {
      const editor = await monaco.init().then(m => m.editor);
      tab = observable({
        id: _.uniqueId(),
        file,
        model: editor.createModel(file.content as string),
        isEdited: false,
        isPined: false
      });
      this.tabs.push(tab);
    }

    this.activeTab = tab;

    return tab;
  }

  @action
  public removeTab(tab: Tab) {
    const idx = this.tabs.findIndex(t => t === tab);
    this.tabs = this.tabs.filter(t => t !== tab);

    if (this.activeTab === tab) {
      this.activeTab =
        this.tabs[idx < this.tabs.length ? idx : idx - 1] ?? null;
    }
  }
}

export default TabStore;
