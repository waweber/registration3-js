import { Schema, SchemaTypes } from "@open-event-systems/interview-lib"
import { useFieldContext } from "./context.js"
import { TextField } from "./text/TextField.js"
import { ObjectField } from "./object/ObjectField.js"

export const Field = () => {
  const ctx = useFieldContext()
  const schema = ctx[1]

  let content

  if (schema["x-type"] == "text") {
    content = <TextField />
  } else if (isSchemaType(schema, "object")) {
    content = <ObjectField />
  } else if (isSchemaType(schema, "string")) {
    content = <TextField />
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