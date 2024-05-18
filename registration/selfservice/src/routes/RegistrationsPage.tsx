import { Title } from "@open-event-systems/registration-common/components"
import { eventRoute } from "./index.js"
import { useEvent, useRegistrations } from "../hooks/api.js"
import { Event } from "../api/types.js"
import { RegistrationList } from "../components/registration/RegistrationList.js"
import { Suspense } from "react"
import { Button, Group } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

export const RegistrationsPage = () => {
  const { eventId } = eventRoute.useParams()
  const event = useEvent(eventId)

  return (
    <Title title="Registrations" subtitle="View and manage registrations">
      <Suspense fallback={<RegistrationList.Placeholder />}>
        <Registrations event={event} />
      </Suspense>
    </Title>
  )
}

const Registrations = ({ event }: { event: Event }) => {
  const registrations = useRegistrations(event.id)

  return (
    <>
      <RegistrationList
        registrations={registrations.map((r) => ({
          key: r.id,
          title: r.title,
          subtitle: r.subtitle,
          description: r.description,
        }))}
      />
      <Group>
        <Button leftSection={<IconPlus />}>Add Registration</Button>
      </Group>
    </>
  )
}
