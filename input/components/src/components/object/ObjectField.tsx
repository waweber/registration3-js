import { Schema } from "@open-event-systems/input-lib"
import { FieldProps } from "../../types.js"
import { DefaultFieldComponent } from "../../fields.js"
import { ComponentType } from "react"

export const ObjectField = (props: {
  name: string
  schema: Schema<"object">
  fieldComponent?: ComponentType<FieldProps>
}) => {
  const { name, schema, fieldComponent = DefaultFieldComponent } = props
  const FieldComponent = fieldComponent

  const children = []
  const schemaProps = schema.properties ?? {}

  for (const key of Object.keys(schemaProps)) {
    const childSchema = schemaProps[key]
    const childName = name ? `${name}.${key}` : key
    children.push(
      <FieldComponent
        name={childName}
        schema={childSchema}
        fieldComponent={FieldComponent}
      />,
    )
  }
  return children
}
