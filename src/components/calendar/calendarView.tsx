import type { EventContentArg } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import iCalendarPlugin from "@fullcalendar/icalendar"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useRef } from "react"

import { useCalendarSettings } from "./calendarHooks"

//Credit: https://github.com/Hjaltesorgenfrei/TimeEditEditEdit/blob/master/TimeEditEditEdit/__init__.py
const nameRegex = /\s*(.*?)\s*:\s*(.*?)\s*(,|$)/g
const icalEvents = {
  url: "https://cloud.timeedit.net/itu/web/public/ri69525055X70YQ25nQ78882ZX56754QQXZ1y455Z.ics",
  format: "ics",
  id: "timeedit"
}
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

const CalendarView = () => {
  const [settings, _setSettings, { isLoading: isLoadingSettings }] =
    useCalendarSettings()
  const calendarRef = useRef<FullCalendar>(null)

  return (
    <>
      {!isLoadingSettings && settings && settings.fromLocalStorage && (
        <FullCalendar
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
            icalEvents,
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
