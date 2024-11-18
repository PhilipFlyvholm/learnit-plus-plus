import type { EventInput } from "@fullcalendar/core"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { useState } from "react"

export type EventDataTransform = ((input: EventInput) => EventInput | false) | undefined
export type EventSource = {
  id: string
  url: string
  format: "ics" | "json" | null,
  color: string,
  textColor?: string,
  eventDataTransform?: EventDataTransform,
  assignmentsOnly?: boolean
}

export type Settings = {
  icalSources: EventSource[]
  showStudentCouncil: boolean
  showScrollbar: boolean
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
  showScrollbar: true,
  showWeekends: false,
  initialview: "timeGridWeek",
  fromLocalStorage: false,
  slotduration: '00:30',
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


type UseErrorReturn = [errors: Map<string, string>, addError:(key: string, error: string) => void, removeError: (key: string) => void,  setErrors: React.Dispatch<React.SetStateAction<Map<string, string>>>]
export const useErrors = (): UseErrorReturn => {
  const [errors, setErrors] = useState<Map<string, string>>(new Map())
  const addError = (key: string, error: string) => {
    setErrors(errors.set(key, error))
  }

  const removeError = (key: string) => {
    const tmpErrors = errors
    tmpErrors.delete(key)
    setErrors(tmpErrors)
  }

  return [errors, addError, removeError, setErrors]
}