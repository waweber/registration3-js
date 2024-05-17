import { Title } from "@open-event-systems/registration-common/components"
import { createRoute } from "@tanstack/react-router"
import { eventRoute } from "./index.js"
import { useEvent, useEvents } from "../hooks/api.js"

export const RegistrationsPage = () => {
  const { eventId } = eventRoute.useParams()
  const event = useEvent(eventId)
  return (
    <Title
      title="Registrations"
      subtitle="View and manage registrations"
    ></Title>
  )
}
