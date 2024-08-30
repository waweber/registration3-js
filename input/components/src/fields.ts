import React, { ComponentType, ReactNode } from "react"
import { FieldProps } from "./types.js"
import { TextField } from "./components/text/TextField.js"
import { isType } from "@open-event-systems/input-lib"
import { ObjectField } from "./components/object/ObjectField.js"
import { NumberField } from "./components/number/NumberField.js"
import { SelectField } from "./components/select/SelectField.js"
import { ArrayField } from "./components/array/ArrayField.js"

export const defaultRenderField = (
  props: FieldProps,
  key?: string | number,
  getFieldComponent = defaultGetFieldComponent,
): ReactNode => {
  const Component = getFieldComponent(props)

  return React.createElement(Component, { key, ...props })
}

export const defaultGetFieldComponent = (
  props: FieldProps,
): ComponentType<FieldProps> => {
  const { schema } = props
  const fieldType = schema["x-type"]

  switch (fieldType) {
    case "text":
      return TextField
    case "number":
      return NumberField
    case "select":
      return SelectField
  }

  if (isType(schema, "object")) {
    return ObjectField as ComponentType<FieldProps>
  } else if (isType(schema, "array")) {
    return ArrayField as ComponentType<FieldProps>
  } else if (isType(schema, "number")) {
    return NumberField
  } else if (isType(schema, "string")) {
    return TextField
  } else {
    return TextField
  }
}
