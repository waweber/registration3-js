import {
  accessCodeRoute,
  eventRoute,
} from "#src/app/routes/selfservice/registrations"
import { Title } from "#src/components/index"
import { Registrations } from "#src/features/selfservice/components/RegistrationsRoute"
import { RegistrationList } from "#src/features/selfservice/components/registration/RegistrationList"
import { Alert, Text } from "@mantine/core"
import { IconSparkles } from "@tabler/icons-react"
import { Suspense } from "react"

export const AccessCodeNotFound = () => (
  <Title title="Not Found">
    <Text component="p">
      The access code was not found. It may have been already used or expired.
    </Text>
  </Title>
)

export const AccessCodeRoute = () => {
  const { accessCode } = accessCodeRoute.useParams()
  const event = eventRoute.useLoaderData()

  return (
    <Title title="Registrations" subtitle="View and manage registrations">
      <Alert title="Access Code" icon={<IconSparkles />}>
        You are using an access code. Add a registration or select a
        registration to change.
      </Alert>
      <Suspense fallback={<RegistrationList.Placeholder />}>
        <Registrations event={event} accessCode={accessCode} />
      </Suspense>
    </Title>
  )
}
