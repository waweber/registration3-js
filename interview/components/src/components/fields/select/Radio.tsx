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
import { Markdown } from "../../markdown/Markdown.js"

export type RadioSelectFieldProps = Omit<RadioGroupProps, "children"> & {
  RadioProps?: Partial<RadioProps>
}

export const RadioSelectField = observer((props: RadioSelectFieldProps) => {
  const { RadioProps, value, label, error, onChange, autoFocus, ...other } =
    useProps("RadioSelectField", {}, props)

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
        {options.map((opt, i) => (
          <Radio
            key={opt.value}
            autoFocus={autoFocus && i == 0 ? true : undefined}
            className="RadioSelectField-radio-root"
            value={opt.value}
            label={<Markdown inline>{opt.label}</Markdown>}
            {...RadioProps}
          />
        ))}
      </Stack>
    </Radio.Group>
  )
})
