import Babel from "@babel/standalone";

Babel.registerPlugin("modify-imports", function() {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const node = path.node;
        /** @type {string} */
        const value = node.source.value;
        if (
          value.startsWith("/") ||
          value.startsWith("./") ||
          value.startsWith("../")
        ) {
          node.source.value = value.concat("?sw");
        } else if (value.startsWith("http")) {
          // skip network imports
        } else if (state.opts.deps[value]) {
          node.source.value = state.opts.deps[value];
        }
      }
    }
  };
});

export const processJS = (content, deps) => {
  return Babel.transform(content, {
    presets: [
      [
        "env",
        {
          modules: false,
          targets: {
            esmodules: true
          }
        }
      ],
      "react"
    ],
    plugins: [["modify-imports", { deps }]]
  }).code;
};
