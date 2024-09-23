import type { EventSourceInput } from "@fullcalendar/core";
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

type Settings = {
    icalSources: EventSourceInput[],
    showStudentCouncil: boolean,
    showWeekends: boolean,
    initialview: "dayGridMonth" | "timeGridWeek" | "timeGridDay"
}
const defaultCalendarSettings:Settings = {
    icalSources: [],
    showStudentCouncil: true,
    showWeekends: false,
    initialview: "timeGridWeek"
}

export type SettingKeys = keyof typeof defaultCalendarSettings;

export const useCalendarSettings = () =>
  useStorage<typeof defaultCalendarSettings>({
    key: "lpp/calendarSettings",
    instance: new Storage({
      area: "local"
    })
  }, (v) => v == undefined ? defaultCalendarSettings : v)
