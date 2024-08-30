import { Meta, StoryObj } from "@storybook/react"
import { NumberField } from "./NumberField.js"
import { Schema } from "@open-event-systems/input-lib"
import { useSchemaForm } from "../../hooks.js"
import { SchemaFormProvider } from "../../providers.js"

const meta: Meta<typeof NumberField> = {
  component: NumberField,
  parameters: {
    layout: "centered",
  },
}

export default meta

const schema = {
  type: "object",
  properties: {
    number: {
      type: "number",
      title: "Number",
      minimum: 0,
      maximum: 10,
    },
  },
  required: ["number"],
} satisfies Schema<"object">

export const Default: StoryObj<typeof NumberField> = {
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
    return (
      <NumberField {...args} schema={schema.properties.number} name="number" />
    )
  },
}
