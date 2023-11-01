//This script is loaded before page load (DOM may not be ready yet)

import { getTheme } from "./styles/main";
/* Add styles to page */
const styleUpdateHandler = async function () {
  let style = document.getElementById("lpp-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "lpp-styles";
    document.head.appendChild(style);
  }
  const localTheme = await chrome.storage.local
    .get("theme")
    .then((res) => res.theme)
    .catch(() => null);

  const theme = getTheme(localTheme);
  style.textContent = theme.css;
  if (theme.hasDarkMode) {
    document.documentElement.classList.add("has-dark-mode");
  } else {
    document.documentElement.classList.remove("has-dark-mode");
  }
};

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

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.theme) {
    styleUpdateHandler();
  }
  if (namespace === "local" && changes.darkMode) {
    loadDarkMode();
  }
});
styleUpdateHandler();
loadDarkMode();
