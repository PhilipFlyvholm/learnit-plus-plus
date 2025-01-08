import { useCalendarSettings } from "./calendarHooks"

const CalendarHeader = ({ toggleView }: { toggleView: () => void }) => {
  const [settings, _setSettings, { isLoading: isLoadingSettings }] =
    useCalendarSettings()
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: ".5rem"
      }}>
      <h5 className="card-title d-block m-0">Calendar</h5>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gap: ".5rem"
        }}>
        {settings.icalSources.length == 0 && (
          <p className="bold">No custom calendars setup yet!</p>
        )}

        <button className="btn btn-outline-secondary" onClick={toggleView}>
          Settings
        </button>
      </div>
    </div>
  )
}
export default CalendarHeader
