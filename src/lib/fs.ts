// import VFile from "./file";
import { observable, action, computed } from "mobx";
import _ from "lodash";
import path from "path";

export class VFile {
  public readonly id = _.uniqueId();
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

export default class VFileSystem {
  @observable
  private fm: Map<string, VFile> = new Map();

  constructor() {
    this.fm.set("/", new VFile({ path: "/" }));
  }

  @action
  public mkdirp(path: string) {
    const paths = path.split("/");

    if (process.env.NODE_ENV === "development") {
      if (paths.includes(".") || paths.includes("..")) {
        console.warn(".. is not support");
      }
    }

    for (let i = 1; i < paths.length; i++) {
      const subpath = paths.slice(0, i + 1).join("/");
      if (!this.exists(subpath)) {
        this.fm.set(subpath, new VFile({ path: subpath }));
      }
    }
  }

  @action
  public writeFile(path: string, content = "") {
    const file = this.fm.get(path);
    if (file) {
      file.content = content;
    } else {
      const file = new VFile({ path, content });
      if (!this.exists(file.dirname)) {
        this.mkdirp(file.dirname);
      }
      this.fm.set(path, file);
    }
  }

  public exists(path: string) {
    return this.fm.has(path);
  }

  @action
  public stats(path: string) {
    return this.fm.get(path);
  }

  @action
  public rename(path: string, newPath: string) {
    // fixme
    this.fm.forEach(f => {
      if (f.dirname.indexOf(path) === 0) {
        this.fm.delete(f.path);
        f.dirname = f.dirname.replace(path, newPath);
        this.fm.set(f.path, f);
      } else if (f.path === path) {
        this.fm.delete(f.path);
        f.path = newPath;
        this.fm.set(f.path, f);
      }
    });
  }

  @action
  public delete(path: string) {
    const file = this.stats(path);
    if (!file) return;

    this.fm.delete(path);
    if (file.isDir) {
      this.fm.forEach(f => {
        // safe delete
        if (f && f.dirname === path) {
          this.delete(f.path);
        }
      });
    }
  }

  public readdir(path: string) {
    const files: VFile[] = [];
    this.fm.forEach(f => {
      // filter root
      if (f.dirname === path && f.basename) {
        files.push(f);
      }
    });
    return files;
  }

  toJSON() {
    const obj = {};
    this.fm.forEach((f, k) => {
      obj[k] = f;
    });
    return JSON.stringify(obj);
  }

  static fromJSON(jsonStr: string) {
    const fs = new VFileSystem();
    try {
      const o = JSON.parse(jsonStr);
      if (Object.keys(o).length > 1) {
        fs.fm.clear();
        for (const k in o) {
          const { path, content, id } = o[k];
          fs.fm.set(k, new VFile({ path, content, id }));
        }
      }
    } catch (error) {
      // ignore
    }

    return fs;
  }
}
