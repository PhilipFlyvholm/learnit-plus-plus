const CalendarHeader = ({toggleView}:{toggleView:() => void}) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h5 className="card-title d-inline">New timeedit</h5>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <button className="btn btn-primary" onClick={toggleView}>
          Settings
        </button>
      </div>
    </div>
  )
}
export default CalendarHeader