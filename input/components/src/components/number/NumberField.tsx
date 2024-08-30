import { NumberInput, NumberInputProps, useProps } from "@mantine/core"
import { FieldProps } from "../../types.js"
import { useFormContext } from "react-hook-form"

export type NumberFieldProps = NumberInputProps & FieldProps

export const NumberField = (props: NumberFieldProps) => {
  const { name, schema, ...other } = useProps("NumberField", {}, props)

  const { register, setValue } = useFormContext()
  const registerProps = register(name)

  return (
    <NumberInput
      classNames={{
        root: "NumberField-root",
      }}
      label={schema.title}
      inputMode={schema["x-inputMode"] as NumberInputProps["inputMode"]}
      autoComplete={schema["x-autoComplete"]}
      {...registerProps}
      min={schema.minimum}
      max={schema.maximum}
      onChange={(v) => {
        setValue(name, v)
      }}
      {...other}
    />
  )
}
