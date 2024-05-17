import { Title } from "@open-event-systems/registration-common/components"
import { createRoute } from "@tanstack/react-router"
import { eventRoute } from "./index.js"
import { useEvent, useEvents, useRegistrations } from "../hooks/api.js"
import { Event } from "../api/types.js"
import { RegistrationList } from "../components/registration/RegistrationList.js"
import { Suspense } from "react"
import { Button, Group } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

export const RegistrationsPage = () => {
  const { eventId } = eventRoute.useParams()
  const event = useEvent(eventId)
  const registrations = useRegistrations(event.id)

  return (
    <Title title="Registrations" subtitle="View and manage registrations">
      {registrations.data && (
        <RegistrationList
          registrations={registrations.data.map((r) => ({
            key: r.id,
            title: r.title,
            subtitle: r.subtitle,
            description: r.description,
          }))}
        />
      )}
      {registrations.isPending && <RegistrationList.Placeholder />}
      {registrations.data && (
        <>
          <Group>
            <Button leftSection={<IconPlus />}>Add Registration</Button>
          </Group>
        </>
      )}
    </Title>
  )
}
