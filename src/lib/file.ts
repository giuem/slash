import path from "path";
import { observable, computed, action } from "mobx";

let uid = Date.now();

export default class VFile {
  public readonly id = uid++;
  @observable
  private _path: string;

  @observable
  public content: string | null;

  constructor({ path, content }: { path: string; content?: string }) {
    if (path[0] !== "/") {
      throw new TypeError("path must be absolute");
    }
    this._path = path;
    this.content = content ?? null;
  }

  @computed
  get path() {
    return this._path;
  }

  set path(p: string) {
    this._path = p;
  }

  @computed
  get dirname() {
    return path.dirname(this.path);
  }

  set dirname(p: string) {
    this._path = p + "/" + this.basename;
  }

  @computed
  get basename() {
    return path.basename(this.path);
  }

  set basename(n: string) {
    this._path = this.dirname + "/" + n;
  }

  @computed
  get extname() {
    return path.extname(this.path);
  }

  get isDir() {
    return this.content === null;
  }
}
