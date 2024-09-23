const CalendarHeader = ({toggleView}:{toggleView:() => void}) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
      <h5 className="card-title d-block m-0">New timeedit</h5>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <button className="btn btn-outline-secondary" onClick={toggleView}>
          Settings
        </button>
      </div>
    </div>
  )
}
export default CalendarHeader