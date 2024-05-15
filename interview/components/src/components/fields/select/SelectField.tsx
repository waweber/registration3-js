import { useFieldContext } from "../context.js"
import { ButtonsSelectField } from "./Buttons.js"
import { CheckboxSelectField } from "./Checkbox.js"
import { DropdownSelectField } from "./Dropdown.js"
import { RadioSelectField } from "./Radio.js"

export type SelectFieldProps = {
  autoFocus?: boolean
}

export const SelectField = (props: SelectFieldProps) => {
  const { autoFocus } = props
  const ctx = useFieldContext()
  const schema = ctx[1]

  switch (schema["x-component"]) {
    case "radio":
      return <RadioSelectField autoFocus={autoFocus} />
    case "checkbox":
      return <CheckboxSelectField autoFocus={autoFocus} />
    case "buttons":
      return <ButtonsSelectField />
    default:
      return <DropdownSelectField autoFocus={autoFocus} />
  }
}
