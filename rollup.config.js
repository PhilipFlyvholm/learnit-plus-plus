// rollup.config.js
import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import del from "rollup-plugin-delete";
import {
  chromeExtension,
  simpleReloader,
} from "rollup-plugin-chrome-extension";
import typescript from "@rollup/plugin-typescript";
import zip from "rollup-plugin-zip";
import copy from "rollup-plugin-copy2";
import { log } from "console";
const isProduction = process.env.NODE_ENV === "production";
const isChrome = process.env.BROWSER === "chrome";
const outputFile = process.env.OUTPUT;

export default {
  input: "src/manifest.json",
  output: {
    dir: "dist",
    format: "esm",
    chunkFileNames: path.join("chunks", "[name]-[hash].js"),
  },
  plugins: [
    // always put chromeExtension() before other plugins
    del({ targets: "dist/*" }),
    chromeExtension(),
    simpleReloader(),
    typescript(),
    resolve({
      browser: true
    }
    ),
    commonjs(),
    copy({
      assets: ["public/images/**/*"]
    }),
    isProduction && zip( isChrome && outputFile ? { file: outputFile } : { dir: "releases" }),
  ],
};
