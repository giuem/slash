import Babel from "@babel/standalone";

export default class Compiler {
  compileJS(content: string) {
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
  }
}
