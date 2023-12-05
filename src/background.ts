/* Add styles to page */
import { DarkModeState, getTheme, type theme } from "~/styles/main"
export {}

let settings: {
  darkMode: boolean
  theme: theme | null
} = {
  darkMode: false,
  theme: null
}

function updateSettings() {
  chrome.storage.local.get(["darkMode", "theme"], (res) => {
    if (res.darkMode !== undefined) settings.darkMode = res.darkMode
    if (res.theme !== undefined) {
      settings.theme = getTheme(res.theme)
    }
    if (settings.theme == null) settings.theme = getTheme()
  })
}

function injectCurrentTheme(tabs: number[], oldTheme: theme) {
  if (tabs.length === 0) return
  if (oldTheme) {
    for (const tab of tabs) {
      chrome.scripting.removeCSS({
        target: { tabId: tab },
        css: oldTheme.css,
      })
    }
  }

  const theme = settings.theme
  if (!theme) return

  for (const tab of tabs) {
    const injectedTheme: chrome.scripting.CSSInjection = {
      target: { tabId: tab },
      css: theme.css
    }

    chrome.scripting.insertCSS(injectedTheme)
  }
}

function shoudAddDarkMode() {
  if (!settings) return false
  if (!settings.theme) return false
  if (settings.theme.darkModeState === DarkModeState.ALWAYS) return true
  return settings.theme.darkModeState === DarkModeState.OPTIONAL && settings.darkMode
}

function initialInjection(tabId: number) {
  if (settings.darkMode) {
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      css: "html { background-color: #000 !important; }"
    })
  }
  const shouldAdd = shoudAddDarkMode()
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    injectImmediately: true,
    func: (darkMode: boolean) => {
      const root = document.documentElement
      if (!!darkMode) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
      console.log("Injected dark mode", darkMode)
    },
    args: [shouldAdd]
  })
  injectCurrentTheme([tabId], settings.theme)
}

const filter = {
  url: [
    {
      urlMatches: 'https://learnit.itu.dk/*',
    },
  ],
};
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return
  //We need this to start the service worker before web load.
  console.log("Before navigate", details)
}, filter)

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return
  if (details.url && details.url.includes("learnit")) {
    initialInjection(details.tabId)
  }
}, filter)

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== "local") return
  if (changes.theme) {
    const oldTheme = settings.theme
      ? settings.theme 
      : getTheme(changes.theme.oldValue)
    
    settings.theme = getTheme(changes.theme.newValue)

    chrome.tabs.query({ url: "https://learnit.itu.dk/*" }, (tabs) => {
      injectCurrentTheme(tabs.map((tab) => tab.id), oldTheme)
    })
  }
  if (changes.darkMode) {
    settings.darkMode = changes.darkMode.newValue
  }
})

updateSettings()
