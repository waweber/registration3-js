import { Schema } from "@open-event-systems/input-lib"
import { ReactNode } from "react"

export type FieldProps = {
  name: string
  schema: Schema
  renderField?: FieldRenderFunc
}

export type FieldRenderFunc = (
  props: FieldProps,
  key?: string | number,
) => ReactNode
