import { adminEventRoute } from "#src/app/routes/admin/admin.js"
import { FullPageMenuLayout } from "#src/components/index.js"
import { Card, NavLink, NavLinkProps, Space } from "@mantine/core"
import { useEvents } from "@open-event-systems/registration-lib/admin"
import { IconChevronRight } from "@tabler/icons-react"
import { createLink } from "@tanstack/react-router"

// workaround for some type inference issues
const _Link = createLink((props: NavLinkProps) => {
  return <NavLink {...props} />
})

export const EventsRoute = () => {
  const events = useEvents()
  return (
    <FullPageMenuLayout>
      <FullPageMenuLayout.Content title="Choose Event">
        <Card.Section>
          {Array.from(events.values(), (e) => (
            <_Link
              key={e.id}
              label={e.title}
              to={adminEventRoute.to}
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
