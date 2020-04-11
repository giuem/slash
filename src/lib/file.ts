import path from "path";
import { observable, computed } from "mobx";

export default class VFile {
  @observable
  public path: string;

  @observable
  public content: string | null;

  constructor({ path, content }: { path: string; content?: string }) {
    if (path[0] !== "/") {
      throw new TypeError("path must be absolute");
    }
    this.path = path;
    this.content = content ?? null;
  }

  @computed
  get dirname() {
    return path.dirname(this.path);
  }

  @computed
  get basename() {
    return path.basename(this.path);
  }

  @computed
  get extname() {
    return path.extname(this.path);
  }

  get isDir() {
    return this.content === null;
  }
}
