import { useId } from "react"

type ColorInptProps = {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const ColorInput = ({ value, onChange }: ColorInptProps) => {
  const id = "colorinput-" + useId()

  return (
    <>
      <label htmlFor={id} className="custom-color-input-label" style={{backgroundColor: value}}></label>
      <input
        type="color"
        className="custom-color-input"
        id={id}
        value={value}
        onChange={onChange}
      />
    </>
  )
}
export default ColorInput;