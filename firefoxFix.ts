import fs from "fs";
function getFileName({ type, id }) {
  let fileName = id
    .replace(/t=\d+&/, "")
    .replace(/\?t=\d+$/, "")
    .replace(/^\//, "")
    .replace(/\?/g, "__")
    .replace(/&/g, "_")
    .replace(/=/g, "--");
  if (fileName.includes("node_modules/")) {
    fileName = `vendor/${fileName
      .split("node_modules/")
      .pop()
      .replace(/\//g, "-")}`;
  } else if (fileName.startsWith("@")) {
    fileName = `vendor/${fileName.slice("@".length).replace(/\//g, "-")}`;
  } else if (fileName.startsWith(".vite/deps/")) {
    fileName = `vendor/${fileName.slice(".vite/deps/".length)}`;
  }
  switch (type) {
    case "iife":
      return `${fileName}.iife.js`;
    case "loader":
      return `${fileName}-loader.js`;
    case "module":
      return `${fileName}.js`;
    case "asset":
      return fileName;
    default:
      throw new Error(
        `Unexpected script type "${type}" for "${JSON.stringify({
          type,
          id,
        })}"`
      );
  }
}
export default function firefoxFix(browser: string) {
  return {
    name: "transform-file",
    writeBundle() {
      if (browser === "firefox") {
        console.log("Applying Firefox fix");

        // Get service-worker-loader file and replace import statement with currect path
        const serviceWorkerLoader = fs.readFileSync(
          "./dist/service-worker-loader.js",
          "utf8"
        );
        let importRegex = /import '(.*)'/g;
        let match: RegExpExecArray | null;
        let scripts: string[] = [];
        while ((match = importRegex.exec(serviceWorkerLoader)) !== null) {
          const path = match[0];
          let file = path.substring(path.lastIndexOf("/") + 1, path.length - 1);
          if (file.endsWith(".ts")) {
            file = file.substring(0, file.length - 3);
          }
          //Find file in assets folder that starts with the same name
          const assets = fs.readdirSync("./dist/assets");
          const asset = assets.find((a) => a.startsWith(file));
          if (!asset) {
            throw new Error(`Could not find asset ${file}`);
          }
          scripts.push(`./assets/${getFileName({ type: "asset", id: asset })}`);
        }

        const manifest = JSON.parse(
          fs.readFileSync("./dist/manifest.json", "utf8")
        );
        manifest.background.scripts = scripts;
        manifest.background.type = "module";
        //Remove from content scripts
        manifest.content_scripts = manifest.content_scripts.filter(
          (script: { js: string[] }) =>
            script.js.filter((s: string) => s.includes("background")).length ===
            0
        );
        fs.writeFileSync("./dist/manifest.json", JSON.stringify(manifest));
        console.log("Firefox fix applied");
      }
    },
  };
}
