import { Meta, StoryObj } from "@storybook/react"
import { AppShellLayout } from "./AppShellLayout.js"
import { NavLink } from "@mantine/core"

import exampleLogo from "../../../resources/example-logo.svg"
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
    const [navbarOpen, setNavbarOpen] = useState(false)
    return (
      <AppShellLayout
        logoSrc={exampleLogo}
        navbarContent={
          <>
            <NavLink label="Link 1" />
            <NavLink label="Link 2" />
          </>
        }
        showNavbar={navbarOpen}
        onToggleNavbar={() => setNavbarOpen(!navbarOpen)}
      >
        Content
      </AppShellLayout>
    )
  },
}
