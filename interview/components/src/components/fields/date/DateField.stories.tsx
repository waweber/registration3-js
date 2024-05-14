import { Box } from "@mantine/core"
import { Schema } from "@open-event-systems/interview-lib"
import { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

import { makeFormState } from "../../../state/form.js"
import { FieldContextProvider } from "../context.js"
import { DateField } from "./DateField.js"

const meta: Meta<typeof DateField> = {
  component: DateField,
  decorators: [
    (Story) => (
      <Box maw={400}>
        <Story />
      </Box>
    ),
  ],
}

export default meta

export const Default: StoryObj<typeof DateField> = {
  render() {
    const schema: Schema = {
      type: "string",
      title: "Date",
      format: "date",
      "x-minDate": "2000-01-01",
      "x-maxDate": "2019-12-31",
    }
    const [formState] = useState(() => makeFormState(schema))
    return (
      <FieldContextProvider state={formState} schema={schema}>
        <DateField />
      </FieldContextProvider>
    )
  },
}
