import { Meta, StoryObj } from "@storybook/react"
import { DateField } from "./DateField.js"
import { Schema } from "@open-event-systems/input-lib"
import { useSchemaForm } from "../../hooks.js"
import { SchemaFormProvider } from "../../providers.js"

const meta: Meta<typeof DateField> = {
  component: DateField,
  parameters: {
    layout: "centered",
  },
}

export default meta

const schema = {
  type: "object",
  properties: {
    date: {
      type: "string",
      title: "Date",
      format: "date",
      "x-minDate": "2000-01-01",
      "x-maxDate": "2000-12-31",
      "x-autoComplete": "bday",
    },
  },
  required: ["date"],
} satisfies Schema<"object">

export const Default: StoryObj<typeof DateField> = {
  decorators: [
    (Story) => {
      const form = useSchemaForm(schema)
      return (
        <SchemaFormProvider {...form}>
          <Story />
        </SchemaFormProvider>
      )
    },
  ],
  render(args) {
    return <DateField {...args} schema={schema.properties.date} name="date" />
  },
}
