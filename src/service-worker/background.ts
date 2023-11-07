/* Add styles to page */

import { getTheme } from "../styles/main";
let injectedThemes: chrome.scripting.CSSInjection[] = [];

function injectCurrentTheme(tabs: chrome.tabs.Tab[]) {

  if (tabs.length === 0) return;
  if (injectedThemes.length > 0) {
    for (const injectedTheme of injectedThemes) {
      chrome.scripting.removeCSS(injectedTheme);
    }
  }
  chrome.storage.local.get("theme").then((res) => {
    const localTheme = res.theme;
    const theme = getTheme(localTheme);
    for (const tab of tabs) {
      if (tab.id === undefined) continue;
      const injectedTheme: chrome.scripting.CSSInjection = {
        target: { tabId: tab.id },
        css: theme.css,
      };
      chrome.scripting.insertCSS(injectedTheme);
      injectedThemes.push(injectedTheme);
    }
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, _changeInfo, tab) {
  if (tab.url && tab.url.includes("learnit")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      injectImmediately: true,
      func: () => {
        chrome.storage.local.get("darkMode").then((res) => {
          const darkModeValue = res.darkMode || false;
          const root = document.documentElement;
          if (!!darkModeValue) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        });
      },
    });
    injectCurrentTheme([tab]);
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.theme) {
    chrome.tabs.query({ url: "https://learnit.itu.dk/*" }).then((tabs) => {
      injectCurrentTheme(tabs);
    });
  }
});
