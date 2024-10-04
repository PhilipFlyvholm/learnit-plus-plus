import { useEffect, useState } from "react"
import {
  useCalendarSettings,
  useErrors,
  type SettingKeys
} from "./calendarHooks"
import CheckboxInput from "./settings/checkboxInput"
import RadioInput from "./settings/radioInput"
import SourceSettings from "./settings/sourceSettings"
import TextInput from "./settings/textInput"

const CalendarSettingsView = () => {
  const [settings, setSettings] = useCalendarSettings()
  const [slotMaxTime, setSlotMaxTime] = useState(settings.slotMaxTime)
  const [slotMinTime, setSlotMinTime] = useState(settings.slotMinTime)
  const [slotDuration, setSlotDuration] = useState(settings.slotduration)
  const [errors, addError, removeError] = useErrors()
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

  function isValidTime(timeString: string): boolean {
    // Regular expression for 24-hour format time (HH:MM:SS)
    const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/

    // Test if the input string matches the regular expression
    return timeRegex.test(timeString)
  }

  function isValidDuration(durationString: string): boolean {
    // Regular expression for duration in HH:MM format
    const durationRegex = /^([0-9][0-9]):[0-5][0-9]$/

    // Test if the input string matches the regular expression
    return durationRegex.test(durationString)
  }

  const handleSlotTimeChange = (
    value: string,
    key: "slotMaxTime" | "slotMinTime"
  ) => {
    const time = value.trim()
    const type = key === "slotMaxTime" ? "max" : "min"
    let success = true
    if (time.trim() == "") {
      addError(key + "-empty", "Slot " + type + " time is empty")
      success = false
    } else {
      removeError(key + "-empty")
    }
    if (isValidTime(time)) {
      removeError(key + "-format")
    } else {
      success = false
      addError(
        key + "-format",
        "Invalid slot " + type + " time format (Expected: HH:MM:SS)"
      )
    }

    if (success) {
      setSettings({
        ...settings,
        [key]: time
      })
    }
  }

  useEffect(() => {
    if (slotMaxTime !== settings.slotMaxTime) {
      setSlotMaxTime(settings.slotMaxTime)
    }
    if (slotMinTime !== settings.slotMinTime) {
      setSlotMinTime(settings.slotMinTime)
    }
    if (slotDuration !== settings.slotduration) {
      setSlotDuration(settings.slotduration)
    }
  }, [settings])

  return (
    <>
      {settings && (
        <div>
          <h2>Calendar Settings</h2>
          <p>Here you can customize the calendar</p>
          <a href="https://github.com/PhilipFlyvholm/learnit-plus-plus/wiki/The-Calendar-Component" target="_blank">Guide for setup</a>
          <br />
          <form>
            {errors.size > 0 && <p className="red">{errors.values().toArray()[0]}</p>}
            <SourceSettings />
            <div className="form-container pb-2">
              <TextInput
                label="Slot start time"
                value={slotMinTime}
                onChange={(e) => {
                  setSlotMinTime(e.target.value)
                  handleSlotTimeChange(e.target.value, "slotMinTime")
                }}
              />
              <TextInput
                label="Slot end time"
                value={slotMaxTime}
                onChange={(e) => {
                  setSlotMaxTime(e.target.value)
                  handleSlotTimeChange(e.target.value, "slotMaxTime")
                }}
              />
              <TextInput
                label="Slot duration"
                value={slotDuration}
                onChange={(e) => {
                  setSlotDuration(e.target.value)
                  const time = e.target.value.trim()
                  let success = true
                  if (time.trim() == "") {
                    addError("slotDuration-empty", "Slot duration is empty")
                    success = false
                  } else {
                    removeError("slotDuration-empty")
                  }
                  if (isValidDuration(time)) {
                    removeError("slotDuration-format")
                  } else {
                    success = false
                    addError(
                      "slotDuration-format",
                      "Invalid slot duration format (Expected: HH:MM)"
                    )
                  }

                  if (success) {
                    setSettings({
                      ...settings,
                      slotduration: time
                    })
                  }
                }}
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
