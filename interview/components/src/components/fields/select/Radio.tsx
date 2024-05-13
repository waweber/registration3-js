import {
  Radio,
  RadioGroupProps,
  RadioProps,
  Stack,
  useProps,
} from "@mantine/core"
import { observer } from "mobx-react-lite"
import { useFieldContext } from "../context.js"
import { getOptions } from "./util.js"

export type RadioSelectFieldProps = Omit<RadioGroupProps, "children"> & {
  RadioProps?: Partial<RadioProps>
}

export const RadioSelectField = observer((props: RadioSelectFieldProps) => {
  const { RadioProps, value, label, error, onChange, ...other } = useProps(
    "RadioSelectField",
    {},
    props,
  )

  const [state, schema, path] = useFieldContext()

  const options = getOptions(schema)

  const stateVal = state?.getValue(path) as string | string[] | undefined

  const val = Array.isArray(stateVal) ? stateVal[0] : stateVal

  return (
    <Radio.Group
      className="RadioSelectField-root"
      label={label ?? schema.title}
      error={
        error ?? (state?.getTouched(path) ? state.getError(path) : undefined)
      }
      value={value ?? val}
      onChange={
        onChange ??
        ((e) => {
          state?.setValue(path, e)
          state?.setTouched(path)
        })
      }
      {...other}
    >
      <Stack className="RadioSelectField-group">
        {options.map((opt) => (
          <Radio
            key={opt.value}
            className="RadioSelectField-radio-root"
            value={opt.value}
            {...RadioProps}
            label={opt.label}
          />
        ))}
      </Stack>
    </Radio.Group>
  )
})
