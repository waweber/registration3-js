import { FullPageMenuLayout } from "@open-event-systems/registration-common/components"
import { Card, NavLink } from "@mantine/core"
import { Link, createRoute } from "@tanstack/react-router"
import { rootRoute } from "./index.js"
import { IconChevronRight } from "@tabler/icons-react"
import { eventRoute } from "./RegistrationsPage.js"
import { getSelfServiceQueryOptions } from "../api/queries.js"

export const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  async loader({ context }) {
    const { queryClient, selfServiceAPI } = context
    const selfServiceQueries = getSelfServiceQueryOptions(selfServiceAPI)
    const events = await queryClient.ensureQueryData(selfServiceQueries.events)
    return events
  },
  component() {
    const events = eventsRoute.useLoaderData()
    return (
      <FullPageMenuLayout>
        <FullPageMenuLayout.Content title="Choose Event">
          <Card.Section>
            {Array.from(events.values(), (e) => (
              <NavLink
                key={e.id}
                label={e.title}
                component={Link}
                to={eventRoute.to}
                params={{
                  eventId: e.id,
                }}
                rightSection={<IconChevronRight />}
              />
            ))}
          </Card.Section>
        </FullPageMenuLayout.Content>
      </FullPageMenuLayout>
    )
  },
})
