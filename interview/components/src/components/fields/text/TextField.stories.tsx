import { Meta, StoryObj } from "@storybook/react"
import { TextField } from "./TextField.js"
import { FieldContextProvider } from "../context.js"
import { useState } from "react"
import { makeFormState } from "../../../state/form.js"
import { Schema } from "@open-event-systems/interview-lib"

const meta: Meta<typeof TextField> = {
  component: TextField,
}

export default meta

export const Default: StoryObj<typeof TextField> = {
  render(args) {
    const schema: Schema = {
      title: "Text Field",
      type: "string",
      minLength: 2,
      maxLength: 10,
    }
    const [formState] = useState(() => makeFormState(schema))
    return (
      <FieldContextProvider state={formState} schema={schema}>
        <TextField {...args} />
      </FieldContextProvider>
    )
  },
}
