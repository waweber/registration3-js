import { getInitialValue, Schema } from "@open-event-systems/input-lib"
import { FieldProps } from "../../types.js"
import { useFormContext, useWatch } from "react-hook-form"
import { Button, Stack } from "@mantine/core"
import { DefaultFieldComponent } from "../../fields.js"
import { ComponentType } from "react"

export const ArrayField = (props: {
  name: string
  schema: Schema<"array">
  fieldComponent?: ComponentType<FieldProps>
}) => {
  const { name, schema, fieldComponent = DefaultFieldComponent } = props
  const FieldComponent = fieldComponent

  const itemSchema = schema.items ?? {}

  const { getValues, setValue, unregister } = useFormContext()
  useWatch({ name: name })
  const value: unknown[] | undefined = getValues(name)
  const len = value ? value.length : 0

  const append = () => {
    const curVal: unknown[] = getValues(name) ?? []
    const newVal = [...curVal, getInitialValue(itemSchema)]
    setValue(name, newVal)
  }

  const remove = (i: number) => {
    const curVal: unknown[] = getValues(name) ?? []
    const first = curVal.slice(0, i)
    const last = curVal.slice(i + 1)
    const newVal = [...first, ...last]
    const removedName = `${name}.${i}`
    unregister(removedName)
    setValue(name, newVal, { shouldValidate: true })
  }

  const children = []

  for (let i = 0; i < len; i++) {
    const childName = `${name}.${i}`
    children.push(
      <Stack key={i}>
        <FieldComponent
          name={childName}
          schema={itemSchema}
          fieldComponent={FieldComponent}
        />
        <Button variant="outline" onClick={() => remove(i)}>
          Remove
        </Button>
      </Stack>,
    )
  }

  return (
    <Stack>
      {children}
      <Button variant="outline" onClick={() => append()}>
        Add
      </Button>
    </Stack>
  )
}
