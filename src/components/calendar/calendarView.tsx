import type { EventContentArg } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import iCalendarPlugin from "@fullcalendar/icalendar"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useRef, useEffect, useState } from 'react';

import { useCalendarSettings } from "./calendarHooks"

//Credit: https://github.com/Hjaltesorgenfrei/TimeEditEditEdit/blob/master/TimeEditEditEdit/__init__.py
const nameRegex = /\s*(.*?)\s*:\s*(.*?)\s*(,|$)/g

const studentCouncilEvents = {
  url: "https://studentcouncil.dk/subscribe",
  format: "ics",
  id: "studentcouncil"
}

function entryToInfo(val: string): Record<number, string> {
  const result: Record<number, string> = {}
  let match: RegExpExecArray | null

  while ((match = nameRegex.exec(val)) !== null) {
    const key = match[1].replace(",", "")
    const value = match[2]

    if (value === "_NN") {
      continue
    }

    result[key] = value
  }

  return result
}

function renderEventContent(eventInfo: EventContentArg) {
  let summary = entryToInfo(eventInfo.event.title)
  let result: string[] = []

  if (summary["Study Activity"]) {
    result.push(summary["Study Activity"].replace(/\.\s*[A-Z0-9]*/g, ""))
  }

  if (result.length == 0) result.push(eventInfo.event.title)
  return (
    <>
      <b>{result.join(" - ")}</b>
      <br />
      <i>{eventInfo.timeText}</i>
    </>
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
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  useEffect(() => {
    let tmpSettingsLoaded = !isLoadingSettings;
    if(settingsLoaded){
      if(settings){
        tmpSettingsLoaded &&= settings.fromLocalStorage;
        tmpSettingsLoaded &&= settings.icalSources.length > 0 || settings.showStudentCouncil;
      }else{
        tmpSettingsLoaded = false;
      }
    }
    setSettingsLoaded(tmpSettingsLoaded)
  },[settings, isLoadingSettings])

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
              if(!source.textColor && source.color){
                source.textColor = getConstrastColor(source.color)
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
