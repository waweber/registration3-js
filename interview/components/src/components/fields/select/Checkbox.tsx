import { observer } from "mobx-react-lite"

import {
  Checkbox,
  CheckboxGroupProps,
  CheckboxProps,
  Stack,
  useProps,
} from "@mantine/core"
import { useFieldContext } from "../context.js"
import { getOptions } from "./util.js"
import { Markdown } from "../../markdown/Markdown.js"

export type CheckboxSelectFieldProps = Omit<CheckboxGroupProps, "children"> & {
  CheckboxProps?: Partial<CheckboxProps>
}

export const CheckboxSelectField = observer(
  (props: CheckboxSelectFieldProps) => {
    const {
      CheckboxProps,
      value,
      label,
      error,
      onChange,
      autoFocus,
      ...other
    } = useProps("CheckboxSelectField", {}, props)

    const [state, schema, path] = useFieldContext()

    const options = getOptions(schema)

    const arrayValue =
      schema.type == "array" ||
      (Array.isArray(schema.type) && schema.type.includes("array"))

    const stateVal = (state ? state.getValue(path) ?? [] : undefined) as
      | string
      | string[]
      | undefined
    const stateValArr = state
      ? (Array.isArray(stateVal) ? stateVal : [stateVal]).filter(
          (v): v is string => !!v,
        )
      : undefined

    return (
      <Checkbox.Group
        className="CheckboxSelectField-root"
        label={label ?? schema.title}
        error={
          error ?? (state?.getTouched(path) ? state.getError(path) : undefined)
        }
        value={value ?? stateValArr}
        onChange={
          onChange ??
          ((e) => {
            if (arrayValue) {
              state?.setValue(path, e)
            } else {
              state?.setValue(path, e[0])
            }
            state?.setTouched(path)
          })
        }
        {...other}
      >
        <Stack className="CheckboxSelectField-group">
          {options.map((opt, i) => (
            <Checkbox
              key={opt.value}
              autoFocus={autoFocus && i == 0 ? true : undefined}
              className="CheckboxSelectField-checkbox-root"
              value={opt.value}
              label={<Markdown inline>{opt.label}</Markdown>}
              {...CheckboxProps}
            />
          ))}
        </Stack>
      </Checkbox.Group>
    )
  },
)
