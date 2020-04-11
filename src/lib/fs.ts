import VFile from "./file";

export default class VFileSystem {
  private fm: Map<string, VFile> = new Map();

  constructor() {
    this.fm.set("/", new VFile({ path: "/" }));
  }

  public mkdirp(path: string) {
    const paths = path.split("/");

    for (let i = 1; i < paths.length; i++) {
      const subpath = paths.slice(0, i + 1).join("/");
      if (!this.exists(subpath)) {
        this.fm.set(subpath, new VFile({ path: subpath }));
      }
    }
  }

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
}
