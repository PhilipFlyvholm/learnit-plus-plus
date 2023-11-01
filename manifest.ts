import { defineManifest, type ManifestV3Export } from "@crxjs/vite-plugin";
const learnITUrl = "https://learnit.itu.dk/*";
// @ts-ignore
import packageJson from "./package.json" assert { type: "json" };
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);
const manifest = (browser: "chrome" | "firefox") => {
  const firefoxOnly = {
    browser_specific_settings: {
      gecko: {
        id: "learnitplusplus@philipflyvholm.github.com",
        strict_min_version: "109.0",
      },
    },
  };
  const crossplatform: ManifestV3Export = {
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
        js: ["src/beforeLoad.ts"],
        run_at: "document_start",
      },
      { js: ["src/popup/App.tsx"], matches: [learnITUrl] },
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
    permissions: ["storage", "scripting"],
    host_permissions: [learnITUrl],
    background: {
      service_worker: "src/service-worker/background.ts",
      type: "module"
    },
    content_security_policy: {
      extension_pages: "default-src 'self'; img-src 'self' data:"
    },
  };
  return defineManifest({
    ...crossplatform,
    ...(browser === "firefox" ? firefoxOnly : {}),
  });
};

export default manifest;
