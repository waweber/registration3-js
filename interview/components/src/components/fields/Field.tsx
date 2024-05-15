import { Schema, SchemaTypes } from "@open-event-systems/interview-lib"
import { useFieldContext } from "./context.js"
import { TextField } from "./text/TextField.js"
import { ObjectField } from "./object/ObjectField.js"
import { SelectField } from "./select/SelectField.js"
import { NumberField } from "./number/NumberField.js"
import { DateField } from "./date/DateField.js"

export const Field = ({ autoFocus }: { autoFocus?: boolean }) => {
  const ctx = useFieldContext()
  const schema = ctx[1]

  let content

  if (schema["x-type"] == "text") {
    content = <TextField autoFocus={autoFocus} />
  } else if (schema["x-type"] == "date") {
    content = <DateField autoFocus={autoFocus} />
  } else if (schema["x-type"] == "number") {
    content = <NumberField autoFocus={autoFocus} />
  } else if (schema["x-type"] == "select") {
    content = <SelectField autoFocus={autoFocus} />
  } else if (isSchemaType(schema, "object")) {
    content = <ObjectField autoFocus={autoFocus} />
  } else if (isSchemaType(schema, "string") && schema.format == "date") {
    content = <DateField autoFocus={autoFocus} />
  } else if (isSchemaType(schema, "string")) {
    content = <TextField autoFocus={autoFocus} />
  } else if (
    isSchemaType(schema, "number") ||
    isSchemaType(schema, "integer")
  ) {
    content = <NumberField autoFocus={autoFocus} />
  } else {
    content = null
  }
  return content
}

const isSchemaType = (schema: Schema, type: SchemaTypes) => {
  return (
    (Array.isArray(schema.type) && schema.type.includes(type)) ||
    schema.type == type
  )
}
