import { defineManifest } from "@crxjs/vite-plugin";
const learnITUrl = "*://learnit.itu.dk/*";
// @ts-ignore
import packageJson from "./package.json" assert { type: 'json' };
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);
const manifest = defineManifest({
  manifest_version: 3,
  name: "LearnIT++",
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  content_scripts: [
    {
      matches: [learnITUrl],
      js: ["src/content.ts"],
      run_at: "document_idle",
    },
    {
      matches: [learnITUrl],
      js: ["src/beforeload.ts"],
      run_at: "document_start",
    },
  ],
  action: {
    default_popup: "index.html",
    default_title: "LearnIT++",
    default_icon: {
      128: "public/images/logo-128.png",
    },
  },
  web_accessible_resources: [
    {
      resources: ["public/**/*"],
      matches: [learnITUrl],
    },
  ],
  // @ts-ignore - Firefox needs this
  browser_specific_settings: {
    gecko: {
      id: "learnitplusplus@philipflyvholm.github.com",
      strict_min_version: "109.0",
    },
  },
});

export default manifest;
