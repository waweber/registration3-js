import { Schema } from "@open-event-systems/input-lib"
import { FieldProps } from "../../types.js"
import { DefaultFieldComponent } from "../../fields.js"
import { ComponentType } from "react"

export const ObjectField = (props: {
  name: string
  schema: Schema<"object">
  fieldComponent?: ComponentType<FieldProps>
  autoFocus?: boolean
}) => {
  const {
    name,
    schema,
    fieldComponent = DefaultFieldComponent,
    autoFocus,
  } = props
  const FieldComponent = fieldComponent

  const children = []
  const schemaProps = schema.properties ?? {}
  let first = true

  for (const key of Object.keys(schemaProps)) {
    const childSchema = schemaProps[key]
    const childName = name ? `${name}.${key}` : key
    const _first = first
    first = false
    children.push(
      <FieldComponent
        name={childName}
        schema={childSchema}
        fieldComponent={FieldComponent}
        autoFocus={_first && autoFocus}
      />,
    )
  }
  return children
}
