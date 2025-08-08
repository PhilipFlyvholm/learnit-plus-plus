import CalendarHeader from "@Components/calendar/calendarHeader"
import CalendarSettingsView from "@Components/calendar/calendarSettingsView"
import CalendarView from "@Components/calendar/calendarView"
import styleText from "data-text:./calendar.css"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoRender
} from "plasmo"
import { useState } from "react"
import { createRoot } from "react-dom/client"

export const config: PlasmoCSConfig = {
  matches: ["https://learnit.itu.dk/my*"]
}

// getRootContainer finds/creates the exact element that will be dragged by Swapy
// so the React root is mounted on the draggable item itself.
export const getRootContainer = () =>
  new Promise<HTMLElement>((resolve) => {
    const checkInterval = setInterval(() => {
      const region = document.querySelector(`#block-region-content`)
      if (!region) return

      // Find or create our block section
      let section = region.querySelector<HTMLElement>("section.block_timeedit")
      if (!section) {
        section = document.createElement("section")
        section.className = "block_timeedit block card mb-3"
        section.setAttribute("role", "complementary")
        section.setAttribute("data-block", "cohortspecifichtml")
        region.appendChild(section)
      }

      // Ensure the draggable item exists and is uniquely identifiable
      let item = section.querySelector<HTMLElement>(".card-body.p-3")
      if (!item) {
        item = document.createElement("div")
        item.className = "card-body p-3"
        section.appendChild(item)
      }
      // Mark as Swapy item with the stable id used in dragAndDrop.ts
      item.setAttribute("data-swapy-item", "block_timeedit")

      clearInterval(checkInterval)
      resolve(item)
    }, 137)
  })

const CalendarRoot = () => {
  const [currentView, setCurrentView] = useState<"calendar" | "settings">(
    "calendar"
  )
  const toggleView = () => {
    setCurrentView(currentView === "calendar" ? "settings" : "calendar")
  }
  return (
    <>
      {/* React root is on the draggable item, no extra wrapper needed */}
      <style>{styleText}</style>
      <div className="calendarRoot">
        <CalendarHeader toggleView={toggleView} />
        {currentView === "calendar" && <CalendarView toggleView={toggleView} />}
        {currentView === "settings" && <CalendarSettingsView />}
      </div>
    </>
  )
}

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-calendar"

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<CalendarRoot />)
}
export default CalendarRoot
