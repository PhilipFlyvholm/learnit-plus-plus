import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest";
import zipPack from "vite-plugin-zip-pack";
import firefoxFix from "./firefoxFix";

const isProduction = process.env.NODE_ENV === "production";
const browser = (process.env.BROWSER || "chrome") as "chrome" | "firefox";
const outputFile = process.env.OUTPUT;

// https://vitejs.dev/config/
export default defineConfig({
  build: browser == "firefox" ? {
    rollupOptions: {
      input: {
        background: "./src/service-worker/background.ts",
      },
    },
  } : {},
  plugins: [
    react(),
    crx({ manifest: manifest(browser), browser }),
    firefoxFix(browser),
    isProduction &&
      zipPack(
        browser === "chrome" && outputFile
          ? { outFileName: outputFile, outDir: "releases" }
          : {
              outFileName: `learnit-plus-plus-${process.env.npm_package_version}.zip`,
              outDir: "releases",
            }
      ),
  ],
  server: {
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173,
    },
  },
});
