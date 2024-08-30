import { getInitialValue, Schema } from "@open-event-systems/input-lib"
import { FieldRenderFunc } from "../../types.js"
import { useFormContext, useWatch } from "react-hook-form"
import { Button, Stack } from "@mantine/core"
import { defaultRenderField } from "../../fields.js"

export const ArrayField = (props: {
  name: string
  schema: Schema<"array">
  renderField?: FieldRenderFunc
}) => {
  const { name, schema, renderField = defaultRenderField } = props

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
    const removedName = `${name}.${newVal.length}`
    setValue(name, newVal, { shouldValidate: true })
    unregister(removedName)
  }

  const children = []

  for (let i = 0; i < len; i++) {
    const childName = `${name}.${i}`
    children.push(
      <Stack key={i}>
        {renderField({ name: childName, schema: itemSchema, renderField })}
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
