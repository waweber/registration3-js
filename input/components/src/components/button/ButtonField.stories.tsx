import { Meta, StoryObj } from "@storybook/react"
import { ButtonField } from "./ButtonField.js"
import { Schema } from "@open-event-systems/input-lib"
import { useSchemaForm } from "../../hooks.js"
import { SchemaFormProvider } from "../../providers.js"

const meta: Meta<typeof ButtonField> = {
  component: ButtonField,
  parameters: {
    layout: "centered",
  },
}

export default meta

const schema = {
  type: "object",
  properties: {
    button: {
      type: "string",
      default: "a",
      oneOf: [
        {
          const: "a",
          title: "Option A",
          "x-primary": true,
        },
        {
          const: "b",
          title: "Option B",
        },
      ],
    },
  },
  required: ["button"],
} satisfies Schema<"object">

export const Default: StoryObj<typeof ButtonField> = {
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
      <ButtonField {...args} schema={schema.properties.button} name="button" />
    )
  },
}
