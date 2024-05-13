import { useFieldContext } from "../context.js"
import { CheckboxSelectField } from "./Checkbox.js"
import { DropdownSelectField } from "./Dropdown.js"
import { RadioSelectField } from "./Radio.js"

export const SelectField = () => {
  const ctx = useFieldContext()
  const schema = ctx[1]

  switch (schema["x-component"]) {
    case "radio":
      return <RadioSelectField />
    case "checkbox":
      return <CheckboxSelectField />
    default:
      return <DropdownSelectField />
  }
}
