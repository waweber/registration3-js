import { Meta, StoryObj } from "@storybook/react"
import { Form } from "./Form.js"
import { Schema } from "@open-event-systems/input-lib"
import { Stack } from "@mantine/core"
import { TextField } from "../text/TextField.js"

const meta: Meta<typeof Form> = {
  component: Form,
  parameters: {
    layout: "centered",
  },
}

export default meta

const schema = {
  type: "object",
  title: "Test Form",
  description: "Test form.",
  properties: {
    first_name: {
      type: "string",
      minLength: 2,
      maxLength: 30,
      title: "First Name",
    },
    last_name: {
      type: "string",
      minLength: 2,
      maxLength: 30,
      title: "Last Name",
    },
    preferred_name: {
      type: ["string", "null"],
      minLength: 2,
      maxLength: 30,
      title: "Preferred Name",
    },
    birth_date: {
      type: "string",
      title: "Birth Date",
      format: "date",
      "x-minDate": "1920-01-01",
      "x-maxDate": "2024-01-01",
    },
    submit: {
      type: "string",
      "x-type": "button",
      oneOf: [
        {
          const: "1",
          title: "Submit",
          "x-primary": true,
        },
      ],
      default: "1",
    },
  },
  required: ["first_name", "last_name", "birth_date"],
} satisfies Schema<"object">

export const Default: StoryObj<typeof Form> = {
  render() {
    return (
      <Form
        schema={schema}
        onSubmit={(v) => {
          console.log(v)
        }}
        fieldsComponent={(props) => (
          <Stack>
            <Form.Fields {...props} />
          </Stack>
        )}
      />
    )
  },
}
