import { useCalendarSettings, type SettingKeys } from "./calendarHooks"
import CheckboxInput from "./settings/checkboxInput"
import RadioInput from "./settings/radioInput"
import SourceSettings from "./settings/sourceSettings"
import TextInput from "./settings/textInput"

const CalendarSettingsView = () => {
  const [settings, setSettings] = useCalendarSettings()
  const handleBooleanSetting = (key: SettingKeys, newValue: boolean) => {
    setSettings({
      ...settings,
      [key]: newValue
    })
  }

  const setInitialView = (value: typeof settings.initialview) => () => {
    setSettings({
      ...settings,
      initialview: value
    })
  }

  return (
    <>
      {settings && (
        <div>
          <h2>Calendar Settings</h2>
          <p>Here you can change the settings for the calendar.</p>
          <form>
            <SourceSettings />
            <div className="form-group" style={{ display: "flex", gap: "2rem"}}>
              <TextInput
                label="Slot start time"
                value={settings.slotMinTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    slotMinTime: e.target.value
                  })
                }
              />
              <TextInput
                label="Slot end time"
                value={settings.slotMaxTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    slotMaxTime: e.target.value
                  })
                }
              />
              <TextInput
                label="Slot duration"
                value={settings.slotduration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    slotduration: e.target.value
                  })
                }
              />
            </div>
            <div className="form-group">
              <p>Calendar options</p>
              <CheckboxInput
                label="Show weekends"
                checked={settings.showWeekends}
                onChange={(e) =>
                  handleBooleanSetting("showWeekends", e.target.checked)
                }
              />
              <CheckboxInput
                label="Show student council events"
                checked={settings.showStudentCouncil}
                onChange={(e) =>
                  handleBooleanSetting("showStudentCouncil", e.target.checked)
                }
              />
              <p className="mt-2 mb-0">Calendar initial view</p>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <RadioInput
                  name="initialViewSetting"
                  id="initialView-dayGridMonth"
                  label="Month"
                  currentValue={"initialView-" + settings.initialview}
                  setCurrentValue={setInitialView("dayGridMonth")}
                />
                <RadioInput
                  name="initialViewSetting"
                  id="initialView-timeGridWeek"
                  label="Week"
                  currentValue={"initialView-" + settings.initialview}
                  setCurrentValue={setInitialView("timeGridWeek")}
                />
                <RadioInput
                  name="initialViewSetting"
                  id="initialView-timeGridDay"
                  label="Day"
                  currentValue={"initialView-" + settings.initialview}
                  setCurrentValue={setInitialView("timeGridDay")}
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
export default CalendarSettingsView
