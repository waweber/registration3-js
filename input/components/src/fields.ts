import React, { ComponentType, ReactNode } from "react"
import { FieldProps } from "./types.js"
import { TextField } from "./components/text/TextField.js"
import { isType } from "@open-event-systems/input-lib"
import { ObjectField } from "./components/object/ObjectField.js"
import { NumberField } from "./components/number/NumberField.js"
import { SelectField } from "./components/select/SelectField.js"
import { ArrayField } from "./components/array/ArrayField.js"
import { DateField } from "./components/date/DateField.js"
import { ButtonField } from "./components/button/ButtonField.js"

export const DefaultFieldComponent = (
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
    case "date":
      return DateField
    case "button":
      return ButtonField
  }

  if (isType(schema, "object")) {
    return ObjectField as ComponentType<FieldProps>
  } else if (isType(schema, "array")) {
    return ArrayField as ComponentType<FieldProps>
  } else if (isType(schema, "number")) {
    return NumberField
  } else if (isType(schema, "string")) {
    if (schema.format == "date") {
      return DateField
    } else {
      return TextField
    }
  } else {
    return TextField
  }
}
