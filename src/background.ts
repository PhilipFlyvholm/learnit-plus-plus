/* Add styles to page */
import { getTheme, type theme } from "~/styles/main";

let injectedThemes: chrome.scripting.CSSInjection[] = [];
let settings: {
  darkMode: boolean;
  theme: theme | null;
} = {
  darkMode: false,
  theme: null,
};

function updateSettings() {
  
  chrome.storage.local.get(["darkMode", "theme"], (res) => {
    if (res.darkMode !== undefined) settings.darkMode = res.darkMode;
    if (res.theme !== undefined) {
      settings.theme = getTheme(res.theme);
    }
    if(settings.theme == null) settings.theme = getTheme();
  });
}

function injectCurrentTheme(tabs: number[]) {
  
  if (tabs.length === 0) return;
  if (injectedThemes.length > 0) {
    for (const injectedTheme of injectedThemes) {
      chrome.scripting.removeCSS(injectedTheme);
    }
  }
  const theme = settings.theme;
  
  if(!theme) return;
  for (const tab of tabs) {
    const injectedTheme: chrome.scripting.CSSInjection = {
      target: { tabId: tab },
      css: theme.css,
    };
    
    chrome.scripting.insertCSS(injectedTheme);
    injectedThemes.push(injectedTheme);
  }
}

function initialInjection(tabId:number){
  if(settings.darkMode){
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      css: "html { background-color: #000 !important; }",
    });
  }
  chrome.scripting.executeScript({
    target: { tabId: tabId },injectImmediately: true,
    func: (d:boolean) => {
      const root = document.documentElement;
      if (!!d) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    },
    args: [settings.darkMode],
  });
  injectCurrentTheme([tabId]);
  
}

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;
  if (details.url && details.url.includes("learnit")) {
    initialInjection(details.tabId)
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== "local") return;
  if (changes.theme) {
    settings.theme = getTheme(changes.theme.newValue);
    injectCurrentTheme(injectedThemes.map((theme) => theme.target.tabId));
  }
  if(changes.darkMode){
    settings.darkMode = changes.darkMode.newValue;
  }
});

updateSettings();
