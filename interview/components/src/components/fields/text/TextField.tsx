import { TextInput, TextInputProps, useProps } from "@mantine/core"
import clsx from "clsx"
import { useFieldContext } from "../context.js"
import { observer } from "mobx-react-lite"

export type TextFieldProps = TextInputProps

export const TextField = observer((props: TextFieldProps) => {
  const {
    className,
    label,
    inputMode,
    autoComplete,
    value,
    error,
    onChange,
    onBlur,
    ...other
  } = useProps("TextField", {}, props)

  const [state, schema, path] = useFieldContext()
  const strValue =
    value != null
      ? value
      : state
        ? (state.getValue(path) as string | null) || ""
        : undefined

  return (
    <TextInput
      className={clsx("TextField-root", className)}
      label={label ?? (schema ? schema.title : undefined)}
      value={strValue}
      onChange={onChange ?? ((v) => state?.setValue(path, v.target.value))}
      onBlur={(e) => {
        state?.setTouched(path)
        onBlur && onBlur(e)
      }}
      error={
        error ?? (state?.getTouched(path) ? state.getError(path) : undefined)
      }
      inputMode={
        inputMode ?? (schema["x-inputMode"] as TextFieldProps["inputMode"])
      }
      autoComplete={autoComplete ?? schema["x-autoComplete"]}
      {...other}
    />
  )
})

TextField.displayName = "TextField"
