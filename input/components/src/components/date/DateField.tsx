import { Group, Input, useProps } from "@mantine/core"
import { FieldProps } from "../../types.js"
import { useController, useFormContext } from "react-hook-form"
import { useError } from "../../hooks.js"
import { FocusEvent, useCallback, useRef } from "react"
import { IconChevronDown } from "@tabler/icons-react"

export type DateFieldProps = FieldProps

export const DateField = (props: DateFieldProps) => {
  const { schema, name } = useProps("DateField", {}, props)

  const monthRef = useRef<HTMLSelectElement | null>(null)
  const dayRef = useRef<HTMLInputElement | null>(null)
  const yearRef = useRef<HTMLInputElement | null>(null)

  const { setValue } = useFormContext()
  const { field, fieldState } = useController({ name: name })
  const error = useError(name)
  const touched = fieldState.isTouched

  const monthRefCallback = useCallback(
    (v: HTMLSelectElement | null) => {
      monthRef.current = v
      field.ref(v)
    },
    [field.ref],
  )

  const autocomplete = schema["x-autoComplete"]

  const [year, month, day] = splitDate(field.value)

  const handleChange = useCallback(() => {
    setValue(
      name,
      joinDate(
        yearRef.current?.value || "",
        monthRef.current?.value || "",
        dayRef.current?.value || "",
      ),
      { shouldValidate: touched },
    )
  }, [name, setValue, touched])

  const handleBlur = useCallback(
    (e: FocusEvent) => {
      if (
        e.relatedTarget != monthRef.current &&
        e.relatedTarget != dayRef.current &&
        e.relatedTarget != yearRef.current
      ) {
        field.onBlur()
      }
    },
    [field.onBlur],
  )

  return (
    <Input.Wrapper label={schema.title} error={error}>
      <Group gap="xs">
        <Input
          ref={monthRefCallback}
          component="select"
          pointer
          title="Month"
          autoComplete={autocomplete == "bday" ? "bday-month" : undefined}
          rightSection={<IconChevronDown size={14} />}
          value={month}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Input>
        <Input
          ref={dayRef}
          title="Day"
          autoComplete={autocomplete == "bday" ? "bday-day" : undefined}
          pattern="[0-9]*"
          maxLength={2}
          inputMode="numeric"
          placeholder="DD"
          w="3em"
          value={day}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          ref={yearRef}
          autoComplete={autocomplete == "bday" ? "bday-year" : undefined}
          title="Year"
          pattern="[0-9]*"
          maxLength={4}
          inputMode="numeric"
          placeholder="YYYY"
          w="5em"
          value={year}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Group>
    </Input.Wrapper>
  )
}

const splitDate = (v: string | null | undefined): [string, string, string] => {
  if (!v || typeof v != "string") {
    return ["", "", ""]
  }

  const parts = v.split("-")
  return [parts[0] || "", parts[1] || "", parts[2] || ""]
}

const joinDate = (year: string, month: string, day: string): string => {
  if (year || month || day) {
    return `${year}-${month}-${day}`
  } else {
    return ""
  }
}

const months = [
  { label: "Jan", value: "01" },
  { label: "Feb", value: "02" },
  { label: "Mar", value: "03" },
  { label: "Apr", value: "04" },
  { label: "May", value: "05" },
  { label: "Jun", value: "06" },
  { label: "Jul", value: "07" },
  { label: "Aug", value: "08" },
  { label: "Sep", value: "09" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" },
] as const
