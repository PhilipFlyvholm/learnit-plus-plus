import { useId, type ChangeEventHandler } from "react"

type ChangeEvent = ChangeEventHandler<HTMLInputElement>
const CheckboxInput = ({
  checked,
  onChange,
  label
}: {
  checked?: boolean
  onChange?: ChangeEvent
  label?: string
}) => {
  const id = "checkboxinput-" + useId()
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={id}
      />
      {label && (
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  )
}

export default CheckboxInput
