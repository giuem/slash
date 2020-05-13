import { VFile } from "./fs";
import { editor } from "monaco-editor";
import { observable, action, autorun, computed } from "mobx";
import _ from "lodash";
import { monaco } from "./monaco";
import emitter, { EVENT_TYPES } from "./event";

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
  public state: editor.ICodeEditorViewState | null;

  // @observable
  // public isEdited = false;

  @computed get isEdited() {
    return this._v > 0;
  }

  @observable private _v = 0;

  @observable disposes: any[] = [];

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

    this.disposes.push(
      this.model.onDidChangeContent(e => {
        // this.isEdited = true;
        if (e.isUndoing) {
          this._v--;
        } else {
          this._v++;
        }
        // const content = this.model.getValue();
        // this.file.content = content;
      })
    );
  }

  updateContent() {
    this.model.setValue(this.file.content!);
    this._v -= 1;
  }

  save() {
    const content = this.model.getValue();
    this._v = 0;
    this.file.content = content;
  }

  dispose() {
    this.disposes.forEach(f => f?.dispose());
    // this.model.dispose();
  }
}

class TabStore {
  @observable.shallow
  public tabs: Array<TabItem> = [];

  @observable
  public activeTab: TabItem | null;

  constructor() {
    if (typeof window !== "undefined")
      document.addEventListener(
        "keydown",
        e => {
          if (
            (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
            e.keyCode == 83
          ) {
            e.preventDefault();
            this.activeTab?.save();
            // Process the event here (such as click on submit button)
          }
        },
        false
      );
  }

  @action
  public async activateTab(file: VFile) {
    let tab = this.tabs.find(t => t.file === file);
    if (!tab) {
      tab = new TabItem(file);
      this.tabs.push(tab);
      autorun(r => {
        if (file.isDeleted) {
          this.removeTab(tab!);
          r.dispose();
        }
      });
    }

    this.activeTab = tab;

    return tab;
  }

  @action
  public removeTab(tab: TabItem) {
    tab.save();
    tab.dispose();
    tab.model.dispose();
    const idx = this.tabs.findIndex(t => t === tab);
    this.tabs = this.tabs.filter(t => t !== tab);

    if (this.activeTab === tab) {
      this.activeTab =
        this.tabs[idx < this.tabs.length ? idx : idx - 1] ?? null;
    }
  }

  public isInTabs(path: string) {
    return this.tabs.find(tab => tab.file.path === path);
  }
}

export default TabStore;

export const tabStore = new TabStore();
