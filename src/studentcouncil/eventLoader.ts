import ICAL from "ical.js";
//webcal://studentcouncil.dk/subscribe
export type EventData = {
  summary: string;
  dtstart: string;
  dtend: string;
  location: string;
  description: string;
  url: string;
};
console.log("Studentcouncil enabled");
export async function getEvents() {
  const response = await fetch("https://studentcouncil.dk/subscribe");
  const text = await response.text();
  const data = ICAL.parse(text);
  console.log(data);
  const cal = new ICAL.Component(data);
  const events: EventData[] = [];
  cal.getAllSubcomponents("vevent").forEach((event) => {
    const eventData: EventData = {
      summary: event.getFirstPropertyValue("summary"),
      url: event.getFirstPropertyValue("url"),
      dtstart: event.getFirstPropertyValue("dtstart"),
      dtend: event.getFirstPropertyValue("dtend"),
      location: event.getFirstPropertyValue("location"),
      description: event.getFirstPropertyValue("description"),
    };
    //Only push if the event is in the future
    if (new Date(eventData.dtend) < new Date()) return;
    events.push(eventData);
  });
  //Sort by date
  events.sort((a, b) => {
    return new Date(a.dtstart).getTime() - new Date(b.dtstart).getTime();
  });
  return events;
}
