import Babel from "@babel/standalone";

export const processJS = content => {
  return Babel.transform(content, {
    presets: ["env", "react"]
  }).code;
};
