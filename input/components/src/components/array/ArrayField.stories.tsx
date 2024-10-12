import { Meta, StoryObj } from "@storybook/react"
import { Schema } from "@open-event-systems/input-lib"
import { useSchemaForm } from "../../hooks.js"
import { SchemaFormProvider } from "../../providers.js"
import { Stack } from "@mantine/core"
import { ArrayField } from "./ArrayField.js"

const meta: Meta<typeof ArrayField> = {
  component: ArrayField,
  parameters: {
    layout: "centered",
  },
}

export default meta

const schema = {
  type: "object",
  properties: {
    names: {
      type: "array",
      title: "Names",
      items: {
        type: "string",
        title: "Name",
        minLength: 2,
        maxLength: 16,
      },
    },
  },
  required: ["names"],
} satisfies Schema<"object">

export const Default: StoryObj<typeof ArrayField> = {
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
  render() {
    return (
      <Stack>
        <ArrayField name="names" schema={schema.properties.names} />
      </Stack>
    )
  },
}
