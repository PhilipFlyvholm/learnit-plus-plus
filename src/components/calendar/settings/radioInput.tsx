const RadioInput = ({name, id, label, currentValue}:{name: string, id: string, label: string, currentValue:string}) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name={name}
        id={id}
        checked={currentValue==id}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default RadioInput
