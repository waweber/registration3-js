import { RegistrationSearchResults } from "#src/features/registration/components/search/RegistrationSearchResults.js"
import { REGISTRATION_STATUS } from "#src/features/registration/types.js"
import { Box } from "@mantine/core"
import { Meta, StoryObj } from "@storybook/react"
import {
  AnyRouter,
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"

const meta: Meta<typeof RegistrationSearchResults> = {
  component: RegistrationSearchResults,
  parameters: {
    layout: "padded",
  },
}

export default meta

export const Default: StoryObj<typeof RegistrationSearchResults> = {
  decorators: [
    (Story) => (
      <Box w={600}>
        <Story />
      </Box>
    ),
    (Story) => {
      const router: AnyRouter = createRouter({
        history: createMemoryHistory(),
        routeTree: createRootRoute({
          component: Story,
        }),
      })

      return <RouterProvider router={router} />
    },
  ],
  args: {
    showMore: true,
    results: [
      {
        id: "1",
        status: REGISTRATION_STATUS.created,
        date_created: "",
        version: 1,
        event_id: "example-event",
        number: 10,
        first_name: "Copley",
        last_name: "Deer",
      },
      {
        id: "2",
        status: REGISTRATION_STATUS.created,
        date_created: "",
        version: 1,
        event_id: "example-event",
        first_name: "First",
        preferred_name: "Preferred",
        last_name: "Last",
        email: "test@example.net",
        number: 4000,
      },
      {
        id: "4",
        status: REGISTRATION_STATUS.created,
        date_created: "",
        version: 1,
        event_id: "example-event",
        email: "test@example.net",
      },
      {
        id: "4",
        status: REGISTRATION_STATUS.created,
        date_created: "",
        version: 1,
        event_id: "example-event",
        email: "test@example.net",
        number: 512,
      },
    ],
  },
}

export const No_Results: StoryObj<typeof RegistrationSearchResults.NoResults> =
  {
    render() {
      return <RegistrationSearchResults.NoResults />
    },
  }
