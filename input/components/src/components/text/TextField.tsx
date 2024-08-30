import { TextInput, TextInputProps, useProps } from "@mantine/core"
import { useFormContext } from "react-hook-form"
import { useError } from "../../hooks.js"
import { FieldProps } from "../../types.js"

export type TextFieldProps = TextInputProps & FieldProps

export const TextField = (props: TextFieldProps) => {
  const { name, schema, ...other } = useProps("TextField", {}, props)

  const { register } = useFormContext()
  const registerProps = register(name)
  const error = useError(name)

  return (
    <TextInput
      classNames={{
        root: "TextField-root",
      }}
      label={schema.title}
      inputMode={schema["x-inputMode"] as TextInputProps["inputMode"]}
      autoComplete={schema["x-autoComplete"]}
      {...registerProps}
      error={error}
      {...other}
    />
  )
}
