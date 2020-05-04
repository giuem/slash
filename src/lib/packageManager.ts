import { computed, action, autorun } from "mobx";
import { fs } from "./fs";
import { tabStore } from "./tabs";

const RE_PKG = /^(@[^/]+\/[^/@]+|[^/@]+)(?:@([\s\S]+))?/;
const PACKAGE_PATH = "/package.json";

export function parsePackageInput(input: string) {
  const matched = input.match(RE_PKG);

  if (!matched) {
    throw new TypeError("input is not a valid package name");
  }

  return {
    name: matched[1],
    version: matched[2]
  };
}

export function getPackageUrl(name: string, version: string) {
  return `https://cdn.pika.dev/${name}/${version}`;
}

const prefetches = new Set();
function preloadModule(url) {
  if (prefetches.has(url)) {
    return;
  }
  const prefetcher = document.createElement("link");
  prefetcher.rel = "prefetch";
  prefetcher.href = url;
  document.head.appendChild(prefetcher);

  prefetches.add(url);
}

class PackageManager {
  constructor() {
    autorun(() => {
      this.dependencies.map(item => {
        preloadModule(getPackageUrl(item.name, item.version));
      });
    });
  }

  @computed get packageJSON() {
    const pkg = fs.stats("/package.json");
    if (!pkg) {
      return null;
    }

    try {
      const { content } = pkg;
      return JSON.parse(content as string);
    } catch (error) {
      console.error("failed to parse package.json", error);
    }

    return null;
  }

  @computed get dependencies() {
    if (this.packageJSON) {
      return Object.entries(
        this.packageJSON.dependencies ?? {}
      ).map(([k, v]) => ({ name: k, version: v as string }));
    }

    return [];
  }

  @action
  public createPackageJSON(projName: string) {
    if (fs.stats(PACKAGE_PATH)) {
      console.warn("package.json exists");
    }

    const json = {
      name: projName,
      version: "1.0.0",
      private: true,
      dependencies: []
    };

    fs.writeFile(PACKAGE_PATH, JSON.stringify(json, null, 4));
  }

  @action writePackageJSON(json: any) {
    const str = JSON.stringify(json, null, 4);
    fs.writeFile(PACKAGE_PATH, str);
    const tab = tabStore.isInTabs(PACKAGE_PATH);
    if (tab) {
      tab.updateContent();
    }
  }

  public async addPackage(pkg: string) {
    const { name, version } = parsePackageInput(pkg);
    const meta = await this.readPackage(name, version);

    if (!this.packageJSON) {
      this.createPackageJSON("my_project");
    }

    const json = Object.assign(this.packageJSON);

    if (!json.dependencies) {
      json.dependencies = {};
    }

    json.dependencies[name] = meta.version;

    this.writePackageJSON(json);
  }

  public removePackage(name: string) {
    const json = Object.assign(this.packageJSON);

    if (!json.dependencies) {
      json.dependencies = {};
    }

    json.dependencies[name] = undefined;

    this.writePackageJSON(json);
  }

  public readPackage(name: string, version?: string) {
    return fetch(
      `https://unpkg.com/${name}@${version || "latest"}/package.json`
    ).then(r => r.json());
  }
}

export default PackageManager;
