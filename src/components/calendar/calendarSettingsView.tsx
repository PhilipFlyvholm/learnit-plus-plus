import { useCalendarSettings, type SettingKeys } from "./calendarHooks"
import RadioInput from "./settings/radioInput"

const CalendarSettingsView = () => {
  const [settings, setSettings] = useCalendarSettings()

  const handleBooleanSetting = (key: SettingKeys, newValue: boolean) => {
    setSettings({
      ...settings,
      [key]: newValue
    })
  }

  return (
    <div>
      <h2>Calendar Settings</h2>
      <p>Here you can change the settings for the calendar.</p>
      <form>
        <div className="form-group">
          <label htmlFor="calendar-url">Calendar URL</label>
          <input
            type="text"
            className="form-control"
            id="calendar-url"
            placeholder="Enter calendar URL"
          />
        </div>
        <div className="form-group">
          <p>Calendar options</p>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={settings.showWeekends}
              onChange={(e) =>
                handleBooleanSetting("showWeekends", e.target.checked)
              }
              id="showWeekends"
            />
            <label className="form-check-label" htmlFor="showWeekends">
              Show weekends
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={settings.showStudentCouncil}
              onChange={(e) =>
                handleBooleanSetting("showStudentCouncil", e.target.checked)
              }
              id="showStudentCouncilEvents"
            />
            <label
              className="form-check-label"
              htmlFor="showStudentCouncilEvents">
              Show student council events
            </label>
          </div>
          <p className="mt-2 mb-0">Calendar initial view</p>
          <div style={{display: "flex", gap: ".5rem"}}>
            <RadioInput
              name="initialViewSetting"
              id="initialView-month"
              label="Month"
              currentValue="initialView-month"
            />
            <RadioInput
              name="initialViewSetting"
              id="initialView-week"
              label="Week"
              currentValue="initialView-month"
            />
            <RadioInput
              name="initialViewSetting"
              id="initialView-day"
              label="Day"
              currentValue="initialView-month"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
export default CalendarSettingsView
