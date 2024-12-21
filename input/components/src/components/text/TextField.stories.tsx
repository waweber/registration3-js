import { Meta, StoryObj } from "@storybook/react"
import { TextField } from "./TextField.js"
import { Schema } from "@open-event-systems/input-lib"
import { useSchemaForm } from "../../hooks.js"
import { SchemaFormProvider } from "../../providers.js"

const meta: Meta<typeof TextField> = {
  component: TextField,
  parameters: {
    layout: "centered",
  },
}

export default meta

const schema = {
  type: "object",
  properties: {
    field: {
      type: ["string", "null"],
      title: "Text Field",
      minLength: 2,
      maxLength: 16,
      pattern: "^[a-z]+$",
    },
  },
  required: ["field"],
} satisfies Schema<"object">

export const Default: StoryObj<typeof TextField> = {
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
    return <TextField {...args} schema={schema.properties.field} name="field" />
  },
}

const multilineSchema = {
  type: "object",
  properties: {
    field: {
      type: ["string", "null"],
      title: "Multiline Field",
      "x-multiline": true,
    },
  },
  required: ["field"],
} satisfies Schema<"object">

export const Multiline: StoryObj<typeof TextField> = {
  decorators: [
    (Story) => {
      const form = useSchemaForm(multilineSchema)
      return (
        <SchemaFormProvider {...form}>
          <Story />
        </SchemaFormProvider>
      )
    },
  ],
  render(args) {
    return (
      <TextField
        {...args}
        schema={multilineSchema.properties.field}
        name="field"
      />
    )
  },
}

const emailSchema = {
  type: "object",
  properties: {
    field: {
      type: ["string", "null"],
      title: "Email",
      format: "email",
    },
  },
  required: ["field"],
} satisfies Schema<"object">

export const Email: StoryObj<typeof TextField> = {
  decorators: [
    (Story) => {
      const form = useSchemaForm(emailSchema)
      return (
        <SchemaFormProvider {...form}>
          <Story />
        </SchemaFormProvider>
      )
    },
  ],
  render(args) {
    return <TextField {...args} schema={schema.properties.field} name="field" />
  },
}
