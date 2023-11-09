//This script is loaded before page load (DOM may not be ready yet)

import { getTheme } from "./styles/main";
setTimeout(async () => {
  //Ensure that if something fails the page is still useable
  document.documentElement.classList.add("loaded");
}, 1000);
async function loadDarkMode() {
  const darkModeValue = await chrome.storage.local
    .get("darkMode")
    .then((res) => res.darkMode)
    .catch(() => false);
  const root = document.documentElement;
  if (!!darkModeValue) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

async function loadCurrentThemeSettings() {
  const localTheme = await chrome.storage.local
    .get("theme")
    .then((res) => res.theme)
    .catch(() => null);

  const theme = getTheme(localTheme);
  if (theme.hasDarkMode) {
    document.documentElement.classList.add("has-dark-mode");
  } else {
    document.documentElement.classList.remove("has-dark-mode");
  }
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.theme) {
    loadCurrentThemeSettings();
  }
  if (namespace === "local" && changes.darkMode) {
    loadDarkMode();
  }
});
loadCurrentThemeSettings();