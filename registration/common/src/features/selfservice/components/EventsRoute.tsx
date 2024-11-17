import { eventsRoute } from "#src/app/routes/selfservice/events.js"
import { selfServiceRegistrationsRoute } from "#src/app/routes/selfservice/registrations.js"
import { FullPageMenuLayout } from "#src/components/index.js"
import { Card, NavLink, Space } from "@mantine/core"
import { useSelfServiceEvents } from "@open-event-systems/registration-lib/selfservice"
import { IconChevronRight } from "@tabler/icons-react"
import { createLink } from "@tanstack/react-router"

// workaround for some type inference issues
const _Link = createLink(NavLink)

export const EventsRoute = () => {
  const events = useSelfServiceEvents()
  return (
    <FullPageMenuLayout>
      <FullPageMenuLayout.Content title="Choose Event">
        <Card.Section>
          {Array.from(events.values(), (e) => (
            <_Link
              key={e.id}
              label={e.title}
              from={eventsRoute.fullPath}
              component={NavLink}
              to={selfServiceRegistrationsRoute.to}
              params={{
                eventId: e.id,
              }}
              rightSection={<IconChevronRight />}
            />
          ))}
        </Card.Section>
        <Space />
      </FullPageMenuLayout.Content>
    </FullPageMenuLayout>
  )
}

export default EventsRoute
