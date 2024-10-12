import { Meta, StoryObj } from "@storybook/react"
import { ObjectField } from "./ObjectField.js"
import { Schema } from "@open-event-systems/input-lib"
import { useSchemaForm } from "../../hooks.js"
import { SchemaFormProvider } from "../../providers.js"
import { Stack } from "@mantine/core"

const meta: Meta<typeof ObjectField> = {
  component: ObjectField,
  parameters: {
    layout: "centered",
  },
}

export default meta

const schema = {
  type: "object",
  properties: {
    first_name: {
      type: "string",
      title: "First Name",
      minLength: 2,
      maxLength: 16,
      pattern: "^[a-z]+$",
    },
    last_name: {
      type: "string",
      title: "Last Name",
      minLength: 2,
      maxLength: 16,
      pattern: "^[a-z]+$",
    },
  },
  required: ["first_name", "last_name"],
} satisfies Schema<"object">

export const Default: StoryObj<typeof ObjectField> = {
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
      <Stack>
        <ObjectField {...args} name="" schema={schema} />
      </Stack>
    )
  },
}

const nestedSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      title: "Title",
      minLength: 2,
      maxLength: 16,
    },
    person: {
      type: "object",
      properties: {
        first_name: {
          type: "string",
          title: "First Name",
          minLength: 2,
          maxLength: 16,
          pattern: "^[a-z]+$",
        },
        last_name: {
          type: "string",
          title: "Last Name",
          minLength: 2,
          maxLength: 16,
          pattern: "^[a-z]+$",
        },
      },
      required: ["first_name", "last_name"],
    },
  },
  required: ["title", "person"],
} satisfies Schema<"object">

export const Nested: StoryObj<typeof ObjectField> = {
  decorators: [
    (Story) => {
      const form = useSchemaForm(nestedSchema)
      return (
        <SchemaFormProvider {...form}>
          <Story />
        </SchemaFormProvider>
      )
    },
  ],
  render(args) {
    return (
      <Stack>
        <ObjectField {...args} name="" schema={nestedSchema} />
      </Stack>
    )
  },
}
