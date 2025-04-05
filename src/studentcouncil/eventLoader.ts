import ICAL from "ical.js"

//webcal://studentcouncil.dk/subscribe/all.ics
export type EventData = {
  summary: string
  dtstart: string
  dtend: string
  description: string
}
console.log("Studentcouncil enabled")
export async function getEvents() {
  const response = await fetch("https://studentcouncil.dk/subscribe/all.ics")
  if (!response.ok) {
    return []
  }
  const text = await response.text()
  const data = ICAL.parse(text)
  const cal = new ICAL.Component(data)
  const events: EventData[] = []
  cal.getAllSubcomponents("vevent").forEach((event) => {
    const eventData: EventData = {
      summary: event.getFirstPropertyValue("summary"),
      dtstart: event.getFirstPropertyValue("dtstart"),
      dtend: event.getFirstPropertyValue("dtend"),
      description: event.getFirstPropertyValue("description")
    }

    //Only push if the event is in the future
    if (new Date(eventData.dtend) < new Date()) return
    events.push(eventData)
  })
  //Sort by date
  events.sort((a, b) => {
    return new Date(a.dtstart).getTime() - new Date(b.dtstart).getTime()
  })
  return events
}
