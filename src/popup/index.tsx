import "./index.css";
import "./nice-forms/nice-forms.css";
import "./nice-forms/nice-forms-theme.css";
import { themes, defaultTheme, DarkModeState } from "~/styles/main";
import { useState, useEffect } from "react";
import { sendToBackground } from "@plasmohq/messaging"

function IndexPopup() {
  //@ts-ignore
  const [settings, setSettings] = useState({
    theme: defaultTheme,
    darkMode: false,
    moreTargetBlank: "off"
  });
  useEffect(() => {
    chrome.storage.local.get(["theme", "darkMode", "moreTargetBlank"], (result) => {
      setSettings({ ...settings, ...result });
    });
  }, []);


  function update(key: string, value: string | boolean) {
    sendToBackground({
      name: "awaiken",
      body: {
        input: "Hello from content script"
      },
    }).then((response) => {
      console.log(response)
    })
    chrome.storage.local.set({ [key]: value }, () => {
      setSettings({ ...settings, [key]: value });
    });
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
          onChange={(e) => update("theme", e.currentTarget.value)}
        >
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
          onChange={(e) => update("moreTargetBlank", e.currentTarget.value)}
        >
          <option value="off">Off</option>
          <option value="external">External links only</option>
          <option value="all">All links</option>
        </select>
      </div>
      <div className="nice-form-group flex" style={{ justifyContent: "space-between" }}>
        <button onClick={() => update("reset", true)}>Reset to default</button>
      </div>
    </div>
  );
}

export default IndexPopup
