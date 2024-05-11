import { TextInput, TextInputProps, useProps } from "@mantine/core"
import clsx from "clsx"
import { useFieldContext } from "../context.js"
import { observer } from "mobx-react-lite"

export type TextFieldProps = TextInputProps & {}

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
    maxLength,
    ...other
  } = useProps("TextField", {}, props)

  const ctx = useFieldContext<string>()
  const strValue =
    value != null ? value : ctx != null ? ctx.value || "" : undefined

  return (
    <TextInput
      className={clsx("TextField-root", className)}
      label={label ?? (ctx ? ctx.schema.title : undefined)}
      value={strValue}
      onChange={
        onChange ?? (ctx ? (v) => ctx.setValue(v.target.value) : undefined)
      }
      onBlur={(e) => {
        ctx?.setTouched()
        onBlur && onBlur(e)
      }}
      error={error ?? (ctx?.touched && ctx.error ? ctx.error : undefined)}
      inputMode={
        inputMode ?? (ctx?.schema["x-inputMode"] as TextFieldProps["inputMode"])
      }
      autoComplete={autoComplete ?? ctx?.schema["x-autoComplete"]}
      {...other}
    />
  )
})

TextField.displayName = "TextField"
