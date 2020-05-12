import Babel from "@babel/standalone";

export const processJS = content => {
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
    ]
  }).code;
};
