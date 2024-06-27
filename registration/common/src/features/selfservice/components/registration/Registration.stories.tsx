import { Meta, StoryObj } from "@storybook/react"
import { Registration } from "./Registration.js"
import { Box } from "@mantine/core"

import exampleLogo from "../../../../../resources/example-logo.svg"

const meta: Meta<typeof Registration> = {
  component: Registration,
  parameters: {
    layout: "centered",
  },
}

export default meta

export const Default: StoryObj<typeof Registration> = {
  args: {
    title: "Copley Deer",
    subtitle: "Sponsor",
    headerColor: undefined,
    description: "Example description.\n\n- Markdown formatted\n- Item 2",
    style: {
      minWidth: 250,
      maxWidth: 300,
    },
  },
}

export const With_Image: StoryObj<typeof Registration> = {
  args: {
    title: "Copley Deer",
    subtitle: "Sponsor",
    headerColor: undefined,
    headerImage: exampleLogo,
    description: "Example description.\n\n- Markdown formatted\n- Item 2",
    style: {
      minWidth: 250,
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
      minWidth: 250,
      maxWidth: 300,
    },
    menuItems: [
      { label: "Upgrade", onClick: () => void 0 },
      { label: "Change badge name", onClick: () => void 0 },
    ],
  },
}

export const Placeholder: StoryObj<typeof Registration> = {
  render() {
    return (
      <Box miw={250} maw={300}>
        <Registration.Placeholder />
      </Box>
    )
  },
}
