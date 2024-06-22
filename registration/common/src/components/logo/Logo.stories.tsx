import { Meta, StoryObj } from "@storybook/react"
import { Logo } from "./Logo.js"

const meta: Meta<typeof Logo> = {
  component: Logo,
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
}

export default meta

export const Default: StoryObj<typeof Logo> = {}
