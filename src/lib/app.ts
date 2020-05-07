import { observable, action, autorun, toJS } from "mobx";
import localforage from "localforage";
interface AppSettings {
  entry: string;
  showPreview: boolean;
}

class AppData {
  @observable settings: AppSettings = {
    entry: "index.html",
    showPreview: false
  };

  constructor() {
    localforage.getItem<AppSettings>("app_settings").then(s => {
      if (s) {
        this.settings = s;
      }
    });

    autorun(() => {
      localforage.setItem("app_settings", toJS(this.settings));
    });
  }

  @action togglePreview = () => {
    this.settings.showPreview = !this.settings.showPreview;
  };
}

export default AppData;

export const appData = new AppData();
