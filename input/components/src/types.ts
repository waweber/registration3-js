import { Schema } from "@open-event-systems/input-lib"
import { ComponentType } from "react"

export type FieldProps = {
  name: string
  schema: Schema
  fieldComponent?: ComponentType<FieldProps>
}
