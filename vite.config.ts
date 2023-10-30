import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest";
import zipPack from "vite-plugin-zip-pack";

const isProduction = process.env.NODE_ENV === "production";
const isChrome = process.env.BROWSER === "chrome";
const outputFile = process.env.OUTPUT;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    isProduction && zipPack(
        isChrome && outputFile ? {outFileName: outputFile, outDir: "releases"} : {outFileName: `learnit-plus-plus-${process.env.npm_package_version}.zip`,outDir: "releases"}
    )
  ],
});