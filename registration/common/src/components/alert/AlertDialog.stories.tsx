import { Meta, StoryObj } from "@storybook/react"
import { AlertDialog } from "./AlertDialog.js"
import {
  Router,
  RouterProvider,
  createHashHistory,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router"
import { AlertProvider, useAlert } from "./AlertProvider.js"
import { Button, Stack, Text } from "@mantine/core"
import { useState } from "react"

const meta: Meta<typeof AlertDialog> = {
  component: AlertDialog,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Confirm: StoryObj<typeof AlertDialog> = {
  args: {
    opened: true,
    title: "Confirm",
    message: "Confirm message.",
    onConfirm: () => void 0,
    onCancel: () => void 0,
  },
}

export const Alert: StoryObj<typeof AlertDialog> = {
  args: {
    opened: true,
    title: "Alert",
    message: "Alert message.",
    cancelText: "Got it",
    onCancel: () => void 0,
  },
}

export const Managed: StoryObj<typeof AlertDialog> = {
  decorators: [
    (Story) => {
      return (
        <AlertProvider>
          <Story />
        </AlertProvider>
      )
    },
    (Story) => {
      const rootRoute = createRootRoute({
        component: Story,
      })
      const history = createHashHistory()
      const router = createRouter({
        routeTree: rootRoute,
        history: history,
      })
      return <RouterProvider router={router} />
    },
  ],
  render() {
    const alert = useAlert()
    const [result, setResult] = useState("")
    return (
      <Stack w={100}>
        <Text>{result}</Text>
        <Button
          onClick={() =>
            alert({ title: "Alert" }).then((res) =>
              setResult(res ? "Confirmed" : "Canceled"),
            )
          }
        >
          Test
        </Button>
      </Stack>
    )
  },
}

export const Managed_Confirm: StoryObj<typeof AlertDialog> = {
  decorators: [
    (Story) => {
      return (
        <AlertProvider>
          <Story />
        </AlertProvider>
      )
    },
    (Story) => {
      const rootRoute = createRootRoute({
        component: Story,
      })
      const history = createHashHistory()
      const router = createRouter({
        routeTree: rootRoute,
        history: history,
      })
      return <RouterProvider router={router} />
    },
  ],
  render() {
    const alert = useAlert()
    const [result, setResult] = useState("")
    return (
      <Stack w={100}>
        <Text>{result}</Text>
        <Button
          onClick={() =>
            alert({
              title: "Confirm",
              confirmText: "Yes",
              cancelText: "No",
            }).then((res) => setResult(res ? "Confirmed" : "Canceled"))
          }
        >
          Test
        </Button>
      </Stack>
    )
  },
}
