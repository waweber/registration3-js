import { Meta, StoryObj } from "@storybook/react"
import { OptionsDialog } from "./OptionsDialog.js"

const meta: Meta<typeof OptionsDialog> = {
  component: OptionsDialog,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<typeof OptionsDialog> = {
  args: {
    title: "Choose",
    options: [
      { id: "1", label: "Option A", href: "#", button: true },
      { id: "2", label: "Option B", href: "#", button: true },
      { id: "3", label: "Option C", href: "#", button: true },
    ],
    opened: true,
    placeholder: false,
  },
}

export const OnSelect_Promise: StoryObj<typeof OptionsDialog> = {
  args: {
    title: "Choose",
    options: [
      { id: "1", label: "Option A", href: "#", button: true },
      { id: "2", label: "Option B", href: "#", button: true },
      { id: "3", label: "Option C", href: "#", button: true },
    ],
    opened: true,
    placeholder: false,
  },
  render(args) {
    return (
      <OptionsDialog
        {...args}
        onSelect={async () => {
          await new Promise((r) => window.setTimeout(r, 1000))
        }}
      />
    )
  },
}
