import { eventsRoute } from "#src/app/routes/selfservice/events.js"
import { selfServiceRegistrationsRoute } from "#src/app/routes/selfservice/registrations.js"
import { FullPageMenuLayout } from "#src/components/index.js"
import { Card, NavLink } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"

export const EventsRoute = () => {
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
              to={selfServiceRegistrationsRoute.to}
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
}

export default EventsRoute
