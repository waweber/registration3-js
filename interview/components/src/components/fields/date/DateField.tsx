import { Fieldset, NativeSelect, Text, TextInput } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { useFieldContext } from "../context.js"

export const DateField = observer(() => {
  const [state, schema, path] = useFieldContext()

  const curValue = state?.getValue(path) as string | undefined
  const split = typeof curValue == "string" ? curValue.split("-") : []
  const [year, tmpMonth, tmpDay] = [...split, "", "", ""]
  const month = tmpMonth || "01"
  const day = unpad(tmpDay)

  const ac = schema["x-autoComplete"] == "bday"
  const showError = state?.getTouched(path)
  const error = state?.getError(path)

  return (
    <Fieldset
      className="DateField-root"
      variant="unstyled"
      legend={schema.title}
    >
      <NativeSelect
        className="DateField-month"
        value={month}
        aria-label="Month"
        autoComplete={ac ? "bday-month" : undefined}
        onChange={(e) => {
          state?.setValue(path, `${year}-${e.target.value}-${pad(day)}`)
        }}
        data={[
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
        ]}
      />
      <TextInput
        className="DateField-day"
        maxLength={2}
        aria-label="Day"
        inputMode="numeric"
        placeholder="DD"
        value={day}
        autoComplete={ac ? "bday-day" : undefined}
        onChange={(e) => {
          state?.setValue(path, `${year}-${month}-${pad(e.target.value)}`)
        }}
      />
      <TextInput
        className="DateField-year"
        width={4}
        aria-label="Year"
        maxLength={4}
        inputMode="numeric"
        placeholder="YYYY"
        value={year}
        autoComplete={ac ? "bday-year" : undefined}
        onChange={(e) => {
          state?.setValue(path, `${e.target.value}-${month}-${pad(day)}`)
        }}
        onBlur={() => {
          state?.setTouched(path)
        }}
      />
      {!!error && !!showError && (
        <Text
          className="DateField-error"
          span
          c="var(--mantine-color-error)"
          size="xs"
        >
          {error}
        </Text>
      )}
    </Fieldset>
  )
})

DateField.displayName = "DateField"

const pad = (s: string) => {
  return s.length == 1 ? "0" + s : s
}

const unpad = (s: string) => {
  return s.length == 2 && s[0] == "0" ? s[1] : s
}
