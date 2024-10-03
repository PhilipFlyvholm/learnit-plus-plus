const RadioInput = ({name, id, label, currentValue, setCurrentValue}:{name: string, id: string, label: string, currentValue:string, setCurrentValue: any}) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name={name}
        id={id}
        checked={currentValue==id}
        onChange={() => setCurrentValue(id)}
        
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default RadioInput
