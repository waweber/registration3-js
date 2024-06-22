import { FullPageMenuLayout } from "@open-event-systems/registration-common/components"
import { useEvents } from "../hooks/api.js"
import { Card, NavLink } from "@mantine/core"
import { Link } from "@tanstack/react-router"
import { eventRoute } from "./index.js"
import { IconChevronRight } from "@tabler/icons-react"

export const EventsPage = () => {
  const events = useEvents()

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
}
