import type { EventContentArg } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import iCalendarPlugin from "@fullcalendar/icalendar"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"

//Credit: https://github.com/Hjaltesorgenfrei/TimeEditEditEdit/blob/master/TimeEditEditEdit/__init__.py
const nameRegex = /\s*(.*?)\s*:\s*(.*?)\s*(,|$)/g
const icalEvents = {
  url: "https://cloud.timeedit.net/itu/web/public/ri69525055X70YQ25nQ78882ZX56754QQXZ1y455Z.ics",
  format: "ics"
}

const testEvents = [
  {
    title: "event 1",
    start: new Date()
  }
]

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
  return (
    <>
      <b>{result.join(" - ")}</b>
      <br />
      <i>{eventInfo.timeText}</i>
    </>
  )
}

const CalendarView = () => {
  return (
    <>
      <FullCalendar
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
        initialView="timeGridWeek"
        events={icalEvents}
        eventContent={renderEventContent}
        firstDay={1} // Monday
        weekNumbers={true}
        weekends={false}
        allDaySlot={false}
        scrollTime={"08:00:00"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
      />
    </>
  )
}
export default CalendarView
