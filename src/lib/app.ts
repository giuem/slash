import { observable, action } from "mobx";

class AppData {
  @observable showPreview = false;

  @action togglePreview = () => {
    this.showPreview = !this.showPreview;
  };
}

export default AppData;

export const appData = new AppData();
