import path from "path";
import { observable, computed } from "mobx";

const ID = () => {
  return `${Math.random().toString(36)}_${Date.now().toString(36)}`;
};

export default class VFile {
  public readonly id = ID();
  @observable
  public path: string;

  @observable
  public content: string | null;

  constructor({
    path,
    content,
    id
  }: {
    path: string;
    content?: string;
    id?: string;
  }) {
    if (path[0] !== "/") {
      throw new TypeError("path must be absolute");
    }
    if (id != null) this.id = id;
    this.path = path;
    this.content = content ?? null;
  }

  @computed
  get dirname() {
    return path.dirname(this.path);
  }

  set dirname(p: string) {
    this.path = p + "/" + this.basename;
  }

  @computed
  get basename() {
    return path.basename(this.path);
  }

  set basename(n: string) {
    this.path = this.dirname + "/" + n;
  }

  @computed
  get extname() {
    return path.extname(this.path);
  }

  get isDir() {
    return this.content === null;
  }
}
