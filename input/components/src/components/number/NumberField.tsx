import {
  NumberInput,
  NumberInputProps,
  TextInputProps,
  useProps,
} from "@mantine/core"
import { FieldProps } from "../../types.js"
import { useFormContext } from "react-hook-form"
import { useError } from "../../hooks.js"

export type NumberFieldProps = NumberInputProps & FieldProps

export const NumberField = (props: NumberFieldProps) => {
  const { name, schema, fieldComponent, ...other } = useProps(
    "NumberField",
    {},
    props,
  )

  const { register, setValue } = useFormContext()
  const registerProps = register(name)
  const error = useError(name)

  return (
    <NumberInput
      classNames={{
        root: "NumberField-root",
      }}
      label={schema.title}
      inputMode={schema["x-inputMode"] as TextInputProps["inputMode"]}
      autoComplete={schema["x-autoComplete"]}
      {...registerProps}
      min={schema.minimum}
      max={schema.maximum}
      error={error}
      onChange={(v) => {
        setValue(name, v)
      }}
      {...other}
    />
  )
}
