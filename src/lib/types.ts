import path from "path";

export function addTypes(pkg: string, version?: string) {}

function fromPackageJSON(pkg: string, version = "latest") {
  const basePath = `https://unpkg.com/${pkg}@${version}`;
  return fetch(`https://unpkg.com/${pkg}@${version}/package.json`)
    .then(r => r.json())
    .then(j => {
      const typeLocation: string = j.types || j.typings;
      if (!typeLocation) return null;
      // if (typeLocation.startsWith('./'))
      return fetch();
    });
}
