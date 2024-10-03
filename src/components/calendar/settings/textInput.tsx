import { useId, type ChangeEventHandler, type HTMLInputTypeAttribute } from "react"

type ChangeEvent = ChangeEventHandler<HTMLInputElement>
const TextInput = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange

}: {
  label?: string
  placeholder?: string
  type?: HTMLInputTypeAttribute
  value?: string
  onChange?: ChangeEvent
}) => {
  const id = "textinput-" + useId()

  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        className="form-control"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}
export default TextInput
