import type { PlasmoCSConfig } from "plasmo"

//This script is loaded before page load (DOM may not be ready yet)
import { DarkModeState, getTheme, type theme } from "~/styles/main"

export const config: PlasmoCSConfig = {
  matches: ["https://learnit.itu.dk/*"],
  run_at: "document_start"
}

let currentTheme: theme | null = null

setTimeout(async () => {
  //Ensure that if something fails the page is still useable
  document.documentElement.classList.add("loaded")
}, 1000)
async function loadDarkMode() {
  const state = currentTheme ? currentTheme.darkModeState : DarkModeState.OPTIONAL
  
  if (state === DarkModeState.ALWAYS) {
    document.documentElement.classList.add("dark")
  } else if (state === DarkModeState.NEVER) {
    document.documentElement.classList.remove("dark")
  } else {
    const darkModeValue = await chrome.storage.local
      .get("darkMode")
      .then((res) => res.darkMode)
      .catch(() => false)
    const root = document.documentElement
    
    if (!!darkModeValue) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }
}

async function loadCurrentThemeSettings() {
  const localTheme = await chrome.storage.local
    .get("theme")
    .then((res) => res.theme)
    .catch(() => null)

  const theme = getTheme(localTheme)
  currentTheme = theme
  if (theme.darkModeState === DarkModeState.OPTIONAL) {
    document.documentElement.classList.add("has-dark-mode")
  } else {
    document.documentElement.classList.remove("has-dark-mode")
  }
  loadDarkMode()
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.theme) {
    loadCurrentThemeSettings()
  }
  else if (namespace === "local" && changes.darkMode) {
    loadDarkMode()
  }
})
loadCurrentThemeSettings()
