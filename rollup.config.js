/* eslint-env node */

import resolve from "@rollup/plugin-node-resolve";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

const env = process.env.NODE_ENV;

/** @type {import("rollup").RollupOptions} */
const config = {
  input: "sw/index.js",
  plugins: [
    resolve(),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env)
    }),
    env === "production" && terser()
  ].filter(Boolean),
  output: {
    file: "public/sw.js"
  }
};

export default config;
