import { useState } from "react";
import { useCalendarSettings } from "../calendarHooks";
import TextInput from "./textInput";

interface IcalSource {
  id: string;
  url: string;
  format: "ics";
}

const SourceSettings = () => {
  const [source, setSource] = useState<IcalSource>({ id: "", url: "", format: "ics" });
  const [settings, setSettings] = useCalendarSettings();
  
  const handleNameChange = (e) => {
    setSource({ ...source, id: e.target.value });
  }

  const handleUrlChange = (e) => {
    setSource({ ...source, url: e.target.value });
  }

  return (
    <div>
      <label>Add iCal Source</label>
      <div className="form-group" style={{ display: "flex", gap: "2rem" }}>
        <TextInput placeholder="Enter a Name" value={source.id} onChange={handleNameChange} />
        <TextInput placeholder="Enter iCal URL" value={source.url} onChange={handleUrlChange} />
        <button className="btn btn-primary mt-2" onClick={(e) => { {/* TODO: fix allignemnt */}
          e.preventDefault();
          setSettings({
            ...settings,
            icalSources: [...settings.icalSources, source]
          });
          setSource({ id: "", url: "", format: "ics" });
        }}>Add</button>
      </div>
      {settings.icalSources.length > 0 && 
        <div className="form-group">
          <label>iCal Sources</label>
          <ul>
            {settings.icalSources.map((source, index) => (
              <>
                <li key={index}>{source.id}</li>
                <button className="btn btn-danger" onClick={(e) => {
                  e.preventDefault();
                  setSettings({
                    ...settings,
                    icalSources: settings.icalSources.filter((s) => s.id !== source.id)
                  });
                }}>Remove</button>
              </>
            ))}
          </ul>
        </div>
      }
    </div>
  );
}

export default SourceSettings;