import "./index.css"
import "./nice-forms/nice-forms.css"
import "./nice-forms/nice-forms-theme.css"

import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { DarkModeState, defaultTheme, themes } from "~/styles/main"

function IndexPopup() {
  //@ts-ignore
  const [settings, setSettings] = useState({
    theme: defaultTheme,
    darkMode: false,
    moreTargetBlank: "off",
    customCSS: ""
  })

  const [openAdvanced, setOpenAdvanced] = useState(false)
  const [openDev, setOpenDev] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(
      ["theme", "darkMode", "moreTargetBlank", "customCSS"],
      (result) => {
        setSettings({ ...settings, ...result })
      }
    )
  }, [])

  function update(key: string, value: string | boolean) {
    sendToBackground({
      name: "awaiken",
      body: {
        input: "Hello from content script"
      }
    }).then((response) => {
      console.log(response)
    })
    chrome.storage.local.set({ [key]: value }, () => {
      setSettings({ ...settings, [key]: value })
    })
  }

  function restoreDefault(key: string, backupKeyPostfix: string = "-backup") {
    chrome.storage.local.get([key + backupKeyPostfix], (result) => {
      const defaultValue = result[key + backupKeyPostfix]
      if (defaultValue !== undefined) {
        chrome.storage.local.set({ [key]: defaultValue }, () => {
          setSettings({ ...settings, [key]: defaultValue })
        })
      } else {
        console.warn(`No backup found for key: ${key}`)
      }
    })
  }

  return (
    <div id="root">
      <div className="flex" style={{ justifyContent: "space-between" }}>
        <img src={"/assets/images/logo-128.png"} width={50} height={50} />
        <h2>Options</h2>
      </div>
      <div className="nice-form-group">
        <label htmlFor="themes">Theme:</label>
        <select
          name="themes"
          id="themes"
          value={settings.theme}
          onChange={(e) => update("theme", e.currentTarget.value)}>
          {Object.keys(themes).map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>
      {themes[settings.theme].darkModeState === DarkModeState.OPTIONAL && (
        <div className="nice-form-group">
          <input
            type="checkbox"
            id="darkMode"
            className="switch"
            checked={settings.darkMode}
            onChange={(e) => update("darkMode", e.currentTarget.checked)}
          />
          <label htmlFor="darkMode">
            Enable dark mode
            <small>Only works if the selected theme supports it</small>
          </label>
        </div>
      )}
      <div className="nice-form-group">
        <label htmlFor="moreTargetBlank">Open links in new tab:</label>
        <select
          name="moreTargetBlank"
          id="moreTargetBlank"
          value={settings.moreTargetBlank}
          onChange={(e) => update("moreTargetBlank", e.currentTarget.value)}>
          <option value="off">Off</option>
          <option value="external">External links only</option>
          <option value="all">All links</option>
        </select>
      </div>

      {/* Toggle button for Advanced Settings */}
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => setOpenAdvanced((v) => !v)}
          aria-expanded={openAdvanced}
          aria-controls="advanced-settings">
          <span>
            {openAdvanced ? "Hide advanced settings" : "Show advanced settings"}
          </span>
          {/* open closed arrow */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            aria-hidden
            focusable="false"
            style={{
              transform: openAdvanced ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.18s ease",
              marginLeft: 8,
              display: "inline-block"
            }}>
            <path
              d="M8 5l8 7-8 7"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        id="advanced-settings"
        style={{ display: openAdvanced ? "block" : "none", marginTop: 12 }}>
        <h3>Advanced Settings</h3>
        <div className="nice-form-group">
          <label htmlFor="customCSS">Custom CSS:</label>
          <textarea
            id="customCSS"
            
            value={settings.customCSS}
            onChange={(e) => update("customCSS", e.currentTarget.value)}
          />
        </div>
        <div
          className="nice-form-group flex"
          style={{ justifyContent: "space-between" }}>
          <button
            onClick={
              () =>
                restoreDefault(
                  "dashboardLayout"
                ) /* this is enough to reset, but we need to use the update sate here, and then have a listener in the content code so the layout will change */
            }>
            Reset dashboard layout
          </button>
        </div>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div style={{ marginTop: "20px", color: "red" }}>
          {/* Toggle button for Development functions */}
          <div style={{ marginBottom: 8 }}>
            <button
              onClick={() => setOpenDev((v) => !v)}
              aria-expanded={openDev}
              aria-controls="dev-settings">
              <span>
                {openDev
                  ? "Hide development functions"
                  : "Show development functions"}
              </span>
              {/* open closed arrow */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                aria-hidden
                focusable="false"
                style={{
                  transform: openDev ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.18s ease",
                  marginLeft: 8,
                  display: "inline-block"
                }}>
                <path
                  d="M8 5l8 7-8 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div
            id="dev-settings"
            style={{ display: openDev ? "block" : "none" }}>
            <h4>Development functions:</h4>
            <div
              className="nice-form-group flex"
              style={{ justifyContent: "space-between" }}>
              <label htmlFor="clearStorage">
                Clear background script storage:
              </label>
              <button
                onDoubleClick={() =>
                  chrome.storage.local.clear(() => alert("Storage cleared"))
                }>
                Double click to clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        Made with ❤️ by{" "}
        <a href="localhost.itu.dk" target="_blank" rel="noreferrer">
          localhost and TA Flyvholm
        </a>
      </div>
    </div>
  )
}

export default IndexPopup
