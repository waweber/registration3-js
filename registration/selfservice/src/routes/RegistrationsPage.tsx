import { Title } from "@open-event-systems/registration-common/components"
import { eventRoute } from "./index.js"
import { useEvent, useRegistrations } from "../hooks/api.js"
import { Event } from "../api/types.js"
import { RegistrationList } from "../components/registration/RegistrationList.js"
import { Suspense } from "react"
import { Button, Group } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { InterviewOptionsDialog } from "../components/options/InterviewOptionsDialog.js"
import { useInterviewOptionsDialog } from "../hooks/interview.js"

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

  const interviewOptions = useInterviewOptionsDialog()

  return (
    <>
      <RegistrationList
        registrations={registrations.registrations.map((r) => ({
          key: r.id,
          title: r.title,
          subtitle: r.subtitle,
          description: r.description,
        }))}
      />
      {interviewOptions.options.length > 0 && (
        <Group>
          <Button leftSection={<IconPlus />} onClick={interviewOptions.show}>
            Add Registration
          </Button>
        </Group>
      )}
      <InterviewOptionsDialog />
    </>
  )
}
