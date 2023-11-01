/*global chrome*/
import "./App.css";
import "./nice-forms/nice-forms.css";
import "./nice-forms/nice-forms-theme.css";
import { themes, defaultTheme } from "../styles/main";
import { useState, useEffect } from "react";
function App() {
  //@ts-ignore
  const [settings, setSettings] = useState({
    theme: defaultTheme,
    darkMode: false,
  });
  useEffect(() => {
    chrome.storage.local.get(["theme", "darkMode"], (result) => {
      setSettings({ ...settings, ...result });
    });
  }, []);

  function update(key: string, value: string | boolean) {
    chrome.storage.local.set({ [key]: value }, () => {
      setSettings({ ...settings, [key]: value });
    });
  }

  return (
    <>
      <div className="flex" style={{ justifyContent: "space-between" }}>
        <img src={"/images/logo-128.png"} width={50} height={50} />
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
      {themes[settings.theme].hasDarkMode && (
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
    </>
  );
}

export default App;
