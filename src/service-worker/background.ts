/* Add styles to page */

import { getTheme } from "../styles/main";
let injectedThemes: chrome.scripting.CSSInjection[] = [];
async function injectCurrentTheme() {
  const tabIds = await chrome.tabs.query({ url: "*://learnit.itu.dk/*" });
  if (tabIds.length === 0) return;
  if (injectedThemes.length > 0) {
    for (const injectedTheme of injectedThemes) {
      chrome.scripting.removeCSS(injectedTheme);
    }
  }
  const localTheme = await chrome.storage.local
    .get("theme")
    .then((res) => res.theme)
    .catch(() => null);

  const theme = getTheme(localTheme);
  for (const tab of tabIds) {
    if (tab.id === undefined) continue;
    const injectedTheme: chrome.scripting.CSSInjection = {
      target: { tabId: tab.id },
      css: theme.css,
    };
    chrome.scripting.insertCSS(injectedTheme);
    injectedThemes.push(injectedTheme);
  }
}

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (
    tab.url &&
    tab.url.includes("learnit") &&
    changeInfo.status &&
    changeInfo.status == "loading"
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      injectImmediately: true,

      func: async () => {
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
      },
    });
    injectCurrentTheme();
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.theme) {
    injectCurrentTheme();
  }
});
