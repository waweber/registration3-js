import { adminRegistrationRoute } from "#src/app/routes/admin/registrations.js"
import { Title } from "#src/components/index.js"
import { RegistrationComponent } from "#src/features/admin/components/registration/Registration.js"
import {
  getRegistrationName,
  useCancelRegistration,
  useCompleteRegistration,
  useRegistration,
} from "@open-event-systems/registration-lib/registration"
import { useIsMutating } from "@tanstack/react-query"

export const RegistrationRoute = () => {
  const { eventId, registrationId } = adminRegistrationRoute.useParams()

  const reg = useRegistration(eventId, registrationId)
  const complete = useCompleteRegistration(eventId, registrationId)
  const cancel = useCancelRegistration(eventId, registrationId)
  const mutating = useIsMutating({
    mutationKey: ["events", eventId, "registrations", registrationId],
  })

  return (
    <Title title={getRegistrationName(reg.registration)}>
      <RegistrationComponent
        registration={reg.registration}
        actions={reg.change_options?.map((o) => ({
          id: o.url,
          label: o.title,
        }))}
        summary={reg.summary}
        onComplete={() => mutating == 0 && complete()}
        onCancel={() => mutating == 0 && cancel()}
      />
    </Title>
  )
}
