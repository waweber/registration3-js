import { Meta, StoryObj } from "@storybook/react"
import { TextField } from "./TextField.js"
import { FieldContextProvider } from "../context.js"
import { useState } from "react"
import { makeFieldState } from "../../../state/field.js"
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
    const [fieldState] = useState(() => makeFieldState<string>(schema))
    return (
      <FieldContextProvider value={fieldState}>
        <TextField {...args} />
      </FieldContextProvider>
    )
  },
}
