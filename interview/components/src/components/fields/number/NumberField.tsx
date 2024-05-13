import { NumberInput, NumberInputProps, useProps } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { useFieldContext } from "../context.js"
import clsx from "clsx"

export type NumberFieldProps = NumberInputProps

export const NumberField = observer((props: NumberFieldProps) => {
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
  } = useProps("NumberField", {}, props)

  const [state, schema, path] = useFieldContext()

  let numVal = value ?? state?.value

  if (typeof numVal == "string") {
    if (numVal != "") {
      const parsed = parseFloat(numVal)
      if (!isNaN(parsed)) {
        numVal = parsed
      }
    }
  }

  const isInt =
    (Array.isArray(schema.type) && schema.type.includes("integer")) ||
    schema.type == "integer"

  return (
    <NumberInput
      className={clsx("NumberField-root")}
      label={label ?? schema.title}
      autoComplete={
        autoComplete ??
        (schema["x-autoComplete"] as NumberInputProps["autoComplete"])
      }
      inputMode={
        inputMode ?? (schema["x-inputMode"] as NumberInputProps["inputMode"])
      }
      min={schema.minimum}
      max={schema.maximum}
      step={isInt ? 1 : undefined}
      {...other}
      value={value}
      onChange={
        onChange ??
        ((v) => {
          if (typeof v == "string") {
            const trimmed = v.trim()
            state?.setValue(path, trimmed)
          } else {
            state?.setValue(path, v)
          }
        })
      }
      onBlur={(e) => {
        state?.setTouched(path)
        onBlur && onBlur(e)
      }}
      error={
        error ?? (state?.getTouched(path) ? state.getError(path) : undefined)
      }
    />
  )
})

NumberField.displayName = "NumberField"
