import { AppShellLayout } from "#src/components/layout/app-shell/AppShellLayout.js"
import { NavLink } from "@mantine/core"
import { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof AppShellLayout> = {
  component: AppShellLayout,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<typeof AppShellLayout> = {
  render() {
    const [opened, setOpened] = useState(false)
    return (
      <AppShellLayout
        menuOpened={opened}
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        title="Title"
        user="User"
        links={[
          <NavLink label="Link 1" />,
          <NavLink label="Link 2" />,
          <NavLink label="Link 3" />,
        ]}
      >
        Content
      </AppShellLayout>
    )
  },
}
