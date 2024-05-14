import { Box, Stack, Text, TextInput } from "@mantine/core"
import { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

import { SelectField } from "./SelectField.js"
import { makeFormState } from "../../../state/form.js"
import { FieldContextProvider } from "../context.js"
import { Schema } from "@open-event-systems/interview-lib"

const meta: Meta<typeof SelectField> = {
  component: SelectField,
  decorators: [
    (Story) => (
      <Box maw={300}>
        <Story />
      </Box>
    ),
  ],
}

export default meta

export const Dropdown: StoryObj<typeof SelectField> = {
  render() {
    const schema: Schema = {
      title: "Select",
      "x-component": "dropdown",
      oneOf: [
        {
          const: "1",
          title: "Option A",
        },
        {
          const: "2",
          title: "Option B",
        },
        {
          const: "3",
          title: "Option C",
        },
      ],
    }

    const [formState] = useState(() => makeFormState(schema))

    return (
      <FieldContextProvider state={formState} schema={schema}>
        <SelectField />
      </FieldContextProvider>
    )
  },
}

export const Radio: StoryObj<typeof SelectField> = {
  render() {
    const schema: Schema = {
      title: "Select",
      "x-component": "radio",
      oneOf: [
        {
          const: "1",
          title: "Option A",
        },
        {
          const: "2",
          title: "Option B",
        },
        {
          const: "3",
          title: "Option C",
        },
      ],
    }

    const [formState] = useState(() => makeFormState(schema))

    return (
      <FieldContextProvider state={formState} schema={schema}>
        <SelectField />
      </FieldContextProvider>
    )
  },
}

export const Checkbox: StoryObj<typeof SelectField> = {
  render() {
    const schema: Schema = {
      type: "array",
      title: "Select",
      "x-component": "checkbox",
      items: {
        oneOf: [
          {
            const: "1",
            title: "Option A",
          },
          {
            const: "2",
            title: "Option B",
          },
          {
            const: "3",
            title: "Option C",
          },
        ],
      },
      minItems: 1,
      maxItems: 2,
      uniqueItems: true,
    }

    const [formState] = useState(() => makeFormState(schema))

    return (
      <FieldContextProvider state={formState} schema={schema}>
        <SelectField />
      </FieldContextProvider>
    )
  },
}

export const Checkbox_as_Boolean: StoryObj<typeof SelectField> = {
  render() {
    const schema: Schema = {
      title: "Boolean",
      "x-component": "checkbox",
      oneOf: [
        {
          const: "1",
          title: "True",
        },
      ],
    }

    const [formState] = useState(() => makeFormState(schema))

    return (
      <FieldContextProvider state={formState} schema={schema}>
        <SelectField />
      </FieldContextProvider>
    )
  },
}

export const Buttons: StoryObj<typeof SelectField> = {
  render() {
    const schema: Schema = {
      title: "Select",
      "x-component": "buttons",
      default: "1",
      oneOf: [
        {
          const: "1",
          title: "Yes!",
          "x-primary": true,
        },
        {
          const: "2",
          title: "Maybe...",
        },
        {
          const: "3",
          title: "No.",
        },
      ],
    }

    const [formState] = useState(() => makeFormState(schema))
    const [val, setVal] = useState("")

    return (
      <form
        onSubmit={(e) => {
          setVal(formState.getValue([]) as string)
          e.preventDefault()
        }}
      >
        <Stack>
          {val && <Text>Value: {val}</Text>}
          <TextInput title="Just to test submit on enter..." />
          <FieldContextProvider state={formState} schema={schema}>
            <SelectField />
          </FieldContextProvider>
        </Stack>
      </form>
    )
  },
}

export const Buttons_Without_Default: StoryObj<typeof SelectField> = {
  render() {
    const schema: Schema = {
      title: "Select",
      "x-component": "buttons",
      oneOf: [
        {
          const: "1",
          title: "Yes!",
        },
        {
          const: "2",
          title: "Maybe...",
        },
        {
          const: "3",
          title: "No.",
        },
      ],
    }

    const [formState] = useState(() => makeFormState(schema))
    const [val, setVal] = useState("")

    return (
      <form
        onSubmit={(e) => {
          setVal(formState.getValue([]) as string)
          e.preventDefault()
        }}
      >
        <Stack>
          {val && <Text>Value: {val}</Text>}
          <TextInput title="Just to test submit on enter..." />
          <FieldContextProvider state={formState} schema={schema}>
            <SelectField />
          </FieldContextProvider>
        </Stack>
      </form>
    )
  },
}
