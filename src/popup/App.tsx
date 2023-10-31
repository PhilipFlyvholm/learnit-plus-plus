/*global chrome*/
import "./App.css";
import "./nice-forms/nice-forms.css";
import "./nice-forms/nice-forms-theme.css";
import { themes } from "../styles/main";
import { useState, useEffect } from "react";
function App() {
  //@ts-ignore
  const [settings, setSettings] = useState({
    theme: "default",
    darkMode: false,
  });
  useEffect(() => {
    console.log(chrome.storage);
    
  });
  return (
    <>
      <div className="flex" style={{ justifyContent: "space-between" }}>
        <img src={"/images/logo-128.png"} width={50} height={50} />
        <h2>Options</h2>
      </div>

      <div className="nice-form-group">
        <label htmlFor="themes">Theme:</label>
        <select name="themes" id="themes">
          {Object.keys(themes).map((theme) => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>
      </div>
      <div className="nice-form-group">
        <input type="checkbox" id="darkMode" className="switch" />
        <label htmlFor="darkMode">
          Enable dark mode
          <small>Only works if the selected theme supports it</small>
        </label>
      </div>
    </>
  );
}

export default App;
