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

// getRootContainer looks for the #block-region-content element and when found creates a new section element which we will use as "root"
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

const CalendarRoot = () => {
  const [currentView, setCurrentView] = useState<"calendar" | "settings">(
    "calendar"
  )
  const toggleView = () => {
    setCurrentView(currentView === "calendar" ? "settings" : "calendar")
  }
  return (
    <>
      <div className="card-body p-3">
        <style>{styleText}</style>
        <div className="calendarRoot">
          <CalendarHeader toggleView={toggleView} />
          {currentView === "calendar" && <CalendarView toggleView={toggleView} />}
          {currentView === "settings" && <CalendarSettingsView />}
        </div>
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
