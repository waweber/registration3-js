import { Meta, StoryObj } from "@storybook/react"
import { Schema } from "@open-event-systems/input-lib"
import { useSchemaForm } from "../../hooks.js"
import { SchemaFormProvider } from "../../providers.js"
import { SelectField } from "./SelectField.js"
import { Box } from "@mantine/core"

const meta: Meta<typeof SelectField> = {
  component: SelectField,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box w={300}>
        <Story />
      </Box>
    ),
  ],
}

export default meta

const dropdownSchema = {
  type: "object",
  properties: {
    select: {
      type: "string",
      title: "Select",
      oneOf: [
        {
          const: "a",
          title: "Option A",
        },
        {
          const: "b",
          title: "Option B",
        },
        {
          const: "c",
          title: "Option C",
        },
      ],
      default: "b",
    },
  },
  required: ["select"],
} satisfies Schema<"object">

export const Dropdown: StoryObj<typeof SelectField> = {
  decorators: [
    (Story) => {
      const form = useSchemaForm(dropdownSchema)
      return (
        <SchemaFormProvider {...form}>
          <Story />
        </SchemaFormProvider>
      )
    },
  ],
  render(args) {
    return (
      <SelectField
        {...args}
        schema={dropdownSchema.properties.select}
        name="select"
      />
    )
  },
}

const dropdownMultiSchema = {
  type: "object",
  properties: {
    select: {
      type: "array",
      title: "Select",
      minItems: 1,
      maxItems: 2,
      items: {
        oneOf: [
          {
            const: "a",
            title: "Option A",
          },
          {
            const: "b",
            title: "Option B",
          },
          {
            const: "c",
            title: "Option C",
          },
        ],
      },
      default: ["b"],
    },
  },
  required: ["select"],
} satisfies Schema<"object">

export const Dropdown_Multi: StoryObj<typeof SelectField> = {
  decorators: [
    (Story) => {
      const form = useSchemaForm(dropdownMultiSchema)
      return (
        <SchemaFormProvider {...form}>
          <Story />
        </SchemaFormProvider>
      )
    },
  ],
  render(args) {
    return (
      <SelectField
        {...args}
        schema={dropdownMultiSchema.properties.select}
        name="select"
      />
    )
  },
}

const checkboxSchema = {
  type: "object",
  properties: {
    select: {
      type: "array",
      title: "Select",
      "x-component": "checkbox",
      minItems: 1,
      maxItems: 2,
      items: {
        oneOf: [
          {
            const: "a",
            title: "Option A",
          },
          {
            const: "b",
            title: "Option B",
          },
          {
            const: "c",
            title: "Option C",
          },
        ],
      },
      default: ["b"],
    },
  },
  required: ["select"],
} satisfies Schema<"object">

export const Checkbox: StoryObj<typeof SelectField> = {
  decorators: [
    (Story) => {
      const form = useSchemaForm(checkboxSchema)
      return (
        <SchemaFormProvider {...form}>
          <Story />
        </SchemaFormProvider>
      )
    },
  ],
  render(args) {
    return (
      <SelectField
        {...args}
        schema={checkboxSchema.properties.select}
        name="select"
      />
    )
  },
}

const radioSchema = {
  type: "object",
  properties: {
    select: {
      type: "string",
      title: "Select",
      "x-component": "radio",
      oneOf: [
        {
          const: "a",
          title: "Option A",
        },
        {
          const: "b",
          title: "Option B",
        },
        {
          const: "c",
          title: "Option C",
        },
      ],
      default: "b",
    },
  },
  required: ["select"],
} satisfies Schema<"object">

export const Radio: StoryObj<typeof SelectField> = {
  decorators: [
    (Story) => {
      const form = useSchemaForm(radioSchema)
      return (
        <SchemaFormProvider {...form}>
          <Story />
        </SchemaFormProvider>
      )
    },
  ],
  render(args) {
    return (
      <SelectField
        {...args}
        schema={radioSchema.properties.select}
        name="select"
      />
    )
  },
}
