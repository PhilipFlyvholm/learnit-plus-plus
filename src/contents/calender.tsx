import dayGridPlugin from "@fullcalendar/daygrid"
import iCalendarPlugin from "@fullcalendar/icalendar"
import FullCalendar from "@fullcalendar/react"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoRender
} from "plasmo"
import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"
import { createRoot } from "react-dom/client"

export const config: PlasmoCSConfig = {
  matches: ["https://learnit.itu.dk/*"]
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
        const rootContainer = document.createElement("div")
        rootContainerParent.appendChild(rootContainer)
        resolve(rootContainer)
      }
    }, 137)
  })

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-calender"
const Calender = () => {
  return (
    <section
      role="complementary"
      data-block="cohortspecifichtml"
      className="block_timeedit block card mb-3">
      <div className="card-body p-3">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h5 className="card-title d-inline">New timeedit</h5>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, iCalendarPlugin]}
          initialView="dayGridMonth"
          events={{
            url: "https://cloud.timeedit.net/itu/web/public/ri69525055X70YQ25nQ78882ZX56754QQXZ1y455Z.ics",
            format: "ics"
          }}
          eventContent={renderEventContent}
        />
      </div>
    </section>
  )
}

function renderEventContent(eventInfo: { timeText: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal; event: { title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal } }) {
    return (
        <>
        <b>EVENT</b>
        </>
    )
    }

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<Calender />)
}
export default Calender
