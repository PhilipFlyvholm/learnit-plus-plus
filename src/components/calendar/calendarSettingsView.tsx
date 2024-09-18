const CalendarSettingsView = () => {
  return (
    <div>
      <h2>Calendar Settings</h2>
      <p>Here you can change the settings for the calendar.</p>
      <form>
        <div className="form-group">
          <label htmlFor="calendar-url">Calendar URL</label>
          <input
            type="text"
            className="form-control"
            id="calendar-url"
            placeholder="Enter calendar URL"
          />
        </div>
        <div className="form-group">
          <p>Calendar options</p>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="showWeekends"
            />
            <label className="form-check-label" htmlFor="showWeekends">
              Show weekends
            </label>
          </div>
        </div>
      </form>
    </div>
  )
}
export default CalendarSettingsView
