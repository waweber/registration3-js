import { Meta, StoryObj } from "@storybook/react"
import { Registration } from "./Registration.js"

const meta: Meta<typeof Registration> = {
  component: Registration,
}

export default meta

export const Default: StoryObj<typeof Registration> = {
  args: {
    title: "Copley Deer",
    subtitle: "Sponsor",
    headerColor: undefined,
    description: "Example description.\n\n- Markdown formatted\n- Item 2",
    style: {
      maxWidth: 300,
    },
  },
}

export const Menu_Items: StoryObj<typeof Registration> = {
  args: {
    title: "Copley Deer",
    subtitle: "Sponsor",
    headerColor: undefined,
    description: "Example description.\n\n- Markdown formatted\n- Item 2",
    style: {
      maxWidth: 300,
    },
    menuItems: [
      { label: "Upgrade", onClick: () => void 0 },
      { label: "Change badge name", onClick: () => void 0 },
    ],
  },
}
