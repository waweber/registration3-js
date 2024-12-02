import { RegistrationComponent } from "#src/features/admin/components/registration/Registration.js"
import { Meta, StoryObj } from "@storybook/react"
import "./Registration.scss"
import {
  AnyRouter,
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { useState } from "react"
import { AlertProvider } from "#src/components/index.js"
import { Box } from "@mantine/core"
import { Registration } from "@open-event-systems/registration-lib/registration"

const meta: Meta<typeof RegistrationComponent> = {
  component: RegistrationComponent,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<typeof RegistrationComponent> = {
  decorators: [
    (Story) => {
      return (
        <Box p="sm">
          <Story />
        </Box>
      )
    },
    (Story) => {
      return (
        <AlertProvider>
          <Story />
        </AlertProvider>
      )
    },
    (Story) => {
      const [router] = useState(() => {
        const root = createRootRoute({ component: Story })
        const router = createRouter({
          history: createMemoryHistory(),
          routeTree: root,
        })
        return router
      })
      return <RouterProvider<AnyRouter> router={router} />
    },
  ],
  args: {
    w: 500,
  },
  render(args) {
    const [reg, setReg] = useState<Registration>(() => ({
      id: "1",
      event_id: "1",
      status: "pending",
      version: 1,
      date_created: "2020-01-01T00:00:00-05:00",
      first_name: "Example",
      last_name: "Person",
      email: "test@example.net",
      nickname: "Example",
      number: 100,
    }))

    return (
      <RegistrationComponent
        registration={reg}
        onComplete={() => {
          setReg({ ...reg, status: "created" })
        }}
        onCancel={() => {
          setReg({ ...reg, status: "canceled" })
        }}
      />
    )
  },
}
