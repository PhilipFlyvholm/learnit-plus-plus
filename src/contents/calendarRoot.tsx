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

// getRootContainer looks for the #block-region-content element and when found creates a new div element which we will use as "root"
export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.querySelector(
        `#block-region-content`
      )
      if (rootContainerParent) {
        clearInterval(checkInterval)
        const rootContainer = document.createElement("section")
        rootContainer.className = "block_timeedit block card mb-3"
        rootContainer.setAttribute("role", "complementary")
        rootContainer.setAttribute("data-block", "cohortspecifichtml")
        rootContainerParent.appendChild(rootContainer)
        resolve(rootContainer)
      }
    }, 137)
  })

const CalenderRoot = () => {
  const [currentView, setCurrentView] = useState<"calendar" | "settings">(
    "calendar"
  )
  const toggleView = () => {
    setCurrentView(currentView === "calendar" ? "settings" : "calendar")
  }
  return (
    <>
      <style>{styleText}</style>
      <div className="card-body p-3 calendarRoot">
        <CalendarHeader toggleView={toggleView} />
        {currentView === "calendar" && <CalendarView />}
        {currentView === "settings" && <CalendarSettingsView />}
      </div>
    </>
  )
}

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-calender"

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<CalenderRoot />)
}
export default CalenderRoot
