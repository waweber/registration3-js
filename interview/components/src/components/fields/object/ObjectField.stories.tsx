import { Meta, StoryObj } from "@storybook/react"
import { ObjectField } from "./ObjectField.js"
import { Schema } from "@open-event-systems/interview-lib"
import { useState } from "react"
import { FieldContextProvider } from "../context.js"
import { makeFormState } from "../../../state/form.js"

const meta: Meta<typeof ObjectField> = {
  component: ObjectField,
}

export default meta

export const Default: StoryObj<typeof ObjectField> = {
  render(args) {
    const schema: Schema = {
      title: "Fields",
      type: "object",
      properties: {
        first_name: {
          type: "string",
          title: "First Name",
          minLength: 2,
          maxLength: 16,
        },
        last_name: {
          type: "string",
          title: "Last Name",
          minLength: 2,
          maxLength: 16,
        },
      },
      required: ["first_name", "last_name"],
    }

    const [state] = useState(() => makeFormState(schema))

    return (
      <FieldContextProvider state={state} schema={schema}>
        <ObjectField {...args} />
      </FieldContextProvider>
    )
  },
}
