import { Schema } from "@open-event-systems/input-lib"
import { FieldRenderFunc } from "../../types.js"
import { defaultRenderField } from "../../fields.js"

export const ObjectField = (props: {
  name: string
  schema: Schema<"object">
  renderField?: FieldRenderFunc
}) => {
  const { name, schema, renderField = defaultRenderField } = props

  const children = []
  const schemaProps = schema.properties ?? {}

  for (const key of Object.keys(schemaProps)) {
    const childSchema = schemaProps[key]
    const childName = name ? `${name}.${key}` : key
    children.push(
      renderField({ name: childName, schema: childSchema, renderField }, key),
    )
  }
  return children
}
