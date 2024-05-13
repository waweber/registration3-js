import { Select, SelectProps, useProps } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { useFieldContext } from "../context.js"
import { getOptions } from "./util.js"

export type DropdownSelectFieldProps = SelectProps

export const DropdownSelectField = observer(
  (props: DropdownSelectFieldProps) => {
    const { label, value, data, error, onChange, onDropdownClose, ...other } =
      useProps("DropdownSelectField", {}, props)

    const [state, schema, path] = useFieldContext()

    const options = getOptions(schema)

    const stateVal = (state ? state.getValue(path) ?? null : undefined) as
      | string
      | null
      | undefined
    const parsedVal = state
      ? Array.isArray(stateVal)
        ? stateVal[0]
        : stateVal
      : undefined

    return (
      <Select
        className="DropdownSelectField-root"
        label={label ?? schema.title}
        clearable
        data={state ? options : undefined}
        error={
          error ?? (state?.getTouched(path) ? state.getError(path) : undefined)
        }
        value={value ?? parsedVal}
        onChange={
          onChange ??
          ((e) => {
            state?.setValue(path, e)
            state?.setTouched(path)
          })
        }
        onDropdownClose={
          onDropdownClose ??
          (() => {
            state?.setTouched(path)
          })
        }
        {...other}
      />
    )
  },
)
