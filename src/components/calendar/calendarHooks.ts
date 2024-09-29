import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

type EventSource = {
  id: string
  url: string
  format: "ics" | "json" | null
}

type Settings = {
  icalSources: EventSource[]
  showStudentCouncil: boolean
  showWeekends: boolean
  initialview: "dayGridMonth" | "timeGridWeek" | "timeGridDay",
  fromLocalStorage: boolean,
  slotduration: string,
  slotMinTime: string,
  slotMaxTime: string,
}
const defaultCalendarSettings: Settings = {
  icalSources: [],
  showStudentCouncil: true,
  showWeekends: false,
  initialview: "timeGridWeek",
  fromLocalStorage: false,
  slotduration: '01:00',
  slotMinTime: '08:00:00',
  slotMaxTime: '20:00:00',
}

export type SettingKeys = keyof typeof defaultCalendarSettings

export const useCalendarSettings = () =>
  useStorage<typeof defaultCalendarSettings>(
    {
      key: "lpp/calendarSettings",
      instance: new Storage({
        area: "local"
      })
    },
    (v) =>
      v == undefined ? (defaultCalendarSettings) : {...v, fromLocalStorage: true}
  )
