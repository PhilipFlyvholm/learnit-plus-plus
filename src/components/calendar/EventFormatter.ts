import type { EventImpl } from "@fullcalendar/core/internal"

//Credit: https://github.com/Hjaltesorgenfrei/TimeEditEditEdit/blob/master/TimeEditEditEdit/__init__.py
const nameRegex = /\s*(.*?)\s*:\s*(.*?)\s*(,|$)/g

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

const Formatters = {
  timeedit: (event: EventImpl): string[] => {

    let summary = entryToInfo(event.title)
    let result: string[] = []

    if (summary["Study Activity"]) {
      result.push(summary["Study Activity"].replace(/\.\s*[A-Z0-9]*/g, "").split(":")[0])
    }

    if (result.length == 0) result.push(event.title)
    return result
  }
}
export const formatEvent = (event: EventImpl): string[] => {
  const source = event.source
  if (source.url.includes("timeedit")) {
    return Formatters.timeedit(event)
  } else {
    return [event.title]
  }
}
