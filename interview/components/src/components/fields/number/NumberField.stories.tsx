import { Meta, StoryObj } from "@storybook/react"
import { NumberField } from "./NumberField.js"
import { FieldContextProvider } from "../context.js"
import { useState } from "react"
import { makeFormState } from "../../../state/form.js"
import { Schema } from "@open-event-systems/interview-lib"

const meta: Meta<typeof NumberField> = {
  component: NumberField,
}

export default meta

export const Default: StoryObj<typeof NumberField> = {
  render(args) {
    const schema: Schema = {
      title: "Number Field",
      type: "number",
      minimum: 0.5,
      maximum: 5.0,
    }
    const [formState] = useState(() => makeFormState(schema))
    return (
      <FieldContextProvider state={formState} schema={schema}>
        <NumberField {...args} />
      </FieldContextProvider>
    )
  },
}

export const Integer: StoryObj<typeof NumberField> = {
  render(args) {
    const schema: Schema = {
      title: "Number Field",
      type: "integer",
      minimum: 1,
      maximum: 5,
    }
    const [formState] = useState(() => makeFormState(schema))
    return (
      <FieldContextProvider state={formState} schema={schema}>
        <NumberField {...args} />
      </FieldContextProvider>
    )
  },
}
