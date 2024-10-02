import { useState, type ChangeEventHandler } from "react"

import { useCalendarSettings, useErrors } from "../calendarHooks"
import type {
  Settings as CalendarSettings,
  EventSource
} from "../calendarHooks"
import TextInput from "./textInput"
import ColorInput from "./colorInput"

type ChangeEvent = ChangeEventHandler<HTMLInputElement>

type CurrentSourceProps = {
  index: number
  source: EventSource
  settings: CalendarSettings
  setSettings: (settings: CalendarSettings) => Promise<void>
}

const DEFAULT_COLOR = "#3788d8"

const CurrentSource = ({
  source,
  settings,
  setSettings
}: CurrentSourceProps) => {
  const [isEditing, setEditing] = useState<boolean>(false)

  const handleColorChange: ChangeEvent = (e) => {
    setSettings({
      ...settings,
      icalSources: settings.icalSources.map((s) =>
        s.id === source.id ? { ...s, color: e.target.value } : s
      )
    })
  }

  return (
    <li className="card my-1">
      <div className="card-body source-container">
        {isEditing ? (
          <CalendarSourceInput
            settings={settings}
            setSettings={setSettings}
            initialICal={source}
            buttonText="Save"
            onUpdate={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="flex">
              <ColorInput value={source.color ?? DEFAULT_COLOR} onChange={handleColorChange}/>

              <p>{source.id}</p>
            </div>
            <div className="flex">
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault()
                  setEditing(true)
                }}>
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) => {
                  e.preventDefault()
                  setSettings({
                    ...settings,
                    icalSources: settings.icalSources.filter(
                      (s) => s.id !== source.id
                    )
                  })
                }}>
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  )
}

type CalendarSourceInputProps = {
  settings: CalendarSettings
  setSettings: (settings: CalendarSettings) => Promise<void>
  initialICal?: EventSource
  buttonText: "Add" | "Save"
  onUpdate?: () => void
}
const CalendarSourceInput = ({
  settings,
  setSettings,
  initialICal = {
    id: "",
    url: "",
    format: "ics",
    color: DEFAULT_COLOR
  },
  buttonText,
  onUpdate = () => {}
}: CalendarSourceInputProps) => {
  const [source, setSource] = useState<EventSource>(initialICal)
  const [errors, addError, removeError] = useErrors()

  const isValid = () => {
    return (
      errors.size == 0 && source.id.trim() !== "" && source.url.trim() !== ""
    )
  }
  const handleNameChange: ChangeEvent = (e) => {
    const name = e.target.value
    if (name.trim() == "") {
      addError("name-empty", "Name-field is empty")
    } else {
      removeError("name-empty")
    }

    setSource({ ...source, id: name })
  }
  const isValidUrl = (urlString: string | URL) => {
    try {
      return Boolean(new URL(urlString))
    } catch (e) {
      return false
    }
  }
  const handleUrlChange: ChangeEvent = (e) => {
    const url = e.target.value
    setSource({ ...source, url: url })
    if (url.trim() == "") {
      addError("url-empty", "URL-field is empty")
      removeError("invalid-url")
    } else {
      if (isValidUrl(url)) {
        removeError("invalid-url")
      } else {
        addError("invalid-url", "Invalid url given")
      }
      removeError("url-empty")
    }
  }

  return (
    <>
      {errors.size > 0 && (
        <p className="my-1 notifyproblem">{errors.values().toArray()[0]}</p>
      )}
      <div className="form-container">
        <div className="flex">
          <TextInput
            placeholder="Enter a Name"
            value={source.id}
            onChange={handleNameChange}
          />
          <TextInput
            placeholder="Enter iCal URL"
            value={source.url}
            onChange={handleUrlChange}
          />
        </div>
        <button
          className="btn btn-primary"
          disabled={!isValid()}
          onClick={(e) => {
            e.preventDefault()
            if (!isValid()) return
            let sources = settings.icalSources
            if (source.id !== initialICal.id && initialICal.id !== "") {
              sources = sources.filter((s) => s.id !== initialICal.id)
            }
            const currentSource = sources.findIndex((s) => s.id == source.id)
            if (currentSource !== -1) {
              sources[currentSource] = source
            } else {
              sources.push(source)
            }
            setSettings({
              ...settings,
              icalSources: sources
            })
            setSource({ id: "", url: "", format: "ics", color: DEFAULT_COLOR })
            onUpdate()
          }}>
          {buttonText}
        </button>
      </div>
    </>
  )
}

const SourceSettings = () => {
  const [settings, setSettings] = useCalendarSettings()

  return (
    <div className="my-2">
      <p className="mt-1 mb-2">Add iCal Source</p>
      <CalendarSourceInput
        settings={settings}
        setSettings={setSettings}
        buttonText="Add"
      />
      <p className="my-1 mt-2">Current iCal Sources</p>
      {settings.icalSources.length > 0 ? (
        <div className="form-group">
          <ul>
            {settings.icalSources.map((source, index) => (
              <CurrentSource
                index={index}
                source={source}
                settings={settings}
                setSettings={setSettings}
                key={index}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p>No sources added</p>
      )}
    </div>
  )
}

export default SourceSettings
