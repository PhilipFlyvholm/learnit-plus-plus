import type { EventContentArg, EventInput } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import iCalendarPlugin from "@fullcalendar/icalendar"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useEffect, useRef, useState } from "react"

import { useCalendarSettings } from "./calendarHooks"
import { formatEvent } from "./EventFormatter"

const studentCouncilEvents = {
  url: "https://studentcouncil.dk/subscribe",
  format: "ics",
  id: "studentcouncil"
}

function renderEventContent(eventInfo: EventContentArg) {
  const result = formatEvent(eventInfo.event)
  return (
    result.length > 0 && (
      <>
        <b>{result.join(" - ")}</b>
        <br />
        <i>{eventInfo.timeText}</i>
      </>
    )
  )
}

const getConstrastColor = (hex: string) => {
  if (hex.startsWith("#")) {
    hex = hex.slice(1)
  }
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "black" : "white"
}

const CalendarView = () => {
  const [settings, _setSettings, { isLoading: isLoadingSettings }] =
    useCalendarSettings()
  const calendarRef = useRef<FullCalendar>(null)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  useEffect(() => {
    let tmpSettingsLoaded = !isLoadingSettings
    if (settingsLoaded) {
      if (settings) {
        tmpSettingsLoaded &&= settings.fromLocalStorage
        tmpSettingsLoaded &&=
          settings.icalSources.length > 0 || settings.showStudentCouncil
      } else {
        tmpSettingsLoaded = false
      }
    }
    setSettingsLoaded(tmpSettingsLoaded)
  }, [settings, isLoadingSettings])

  return (
    <>
      {settingsLoaded && (
        <FullCalendar
          slotDuration={settings.slotduration}
          slotMinTime={settings.slotMinTime}
          slotMaxTime={settings.slotMaxTime}
          ref={calendarRef}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "08:00",
            endTime: "18:00"
          }}
          plugins={[dayGridPlugin, timeGridPlugin, iCalendarPlugin]}
          nowIndicator={true}
          initialView={settings.initialview}
          eventSources={[
            ...settings.icalSources.map((source) => {
              if (!source.textColor && source.color) {
                source.textColor = getConstrastColor(source.color)
              }
              if (
                source.activitiesOnly &&
                source.url.startsWith(
                  "https://learnit.itu.dk/calendar/export_execute.php"
                )
              ) {
                source.eventDataTransform = (input: EventInput) => {
                  if (
                    input.title.includes("Lecture") ||
                    input.title.includes("Exercise")||
                    input.title.includes("Other")
                  ) {
                    return false
                  }
                  return input
                }
              }
              return source
            }),
            settings.showStudentCouncil && studentCouncilEvents
          ]}
          eventContent={renderEventContent}
          firstDay={1} // Monday
          weekNumbers={true}
          weekends={settings.showWeekends}
          allDaySlot={false}
          scrollTime={"08:00:00"}
          eventClick={(info) => {
            info.jsEvent.preventDefault() // don't let the browser navigate
            if (info.event.url) {
              const url = info.event.url.startsWith("http")
                ? info.event.url
                : "https://" + info.event.url
              window.open(url)
            }
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
        />
      )}
    </>
  )
}
export default CalendarView
