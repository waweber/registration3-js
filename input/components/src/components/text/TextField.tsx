import {
  Textarea,
  TextareaProps,
  TextInput,
  TextInputProps,
  useProps,
} from "@mantine/core"
import { useFormContext } from "react-hook-form"
import { useError } from "../../hooks.js"
import { FieldProps } from "../../types.js"

export type TextFieldProps = TextInputProps & TextareaProps & FieldProps

export const TextField = (props: TextFieldProps) => {
  const { name, schema, fieldComponent, ...other } = useProps(
    "TextField",
    {},
    props,
  )

  const { register } = useFormContext()
  const registerProps = register(name)
  const error = useError(name)

  if (schema["x-multiline"]) {
    return (
      <Textarea
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
