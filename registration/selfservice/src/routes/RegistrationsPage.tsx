import {
  OptionsDialog,
  Spacer,
  Title,
} from "@open-event-systems/registration-common/components"
import {
  accessCodeRoute,
  cartRoute,
  changeRegistrationRoute,
  eventRoute,
} from "./index.js"
import { useAccessCodeCheck, useEvent, useRegistrations } from "../hooks/api.js"
import { Event } from "../api/types.js"
import { RegistrationList } from "../components/registration/RegistrationList.js"
import { Suspense } from "react"
import {
  Alert,
  Button,
  Grid,
  Text,
  Title as MTitle,
  Divider,
} from "@mantine/core"
import { IconPlus, IconSparkles } from "@tabler/icons-react"
import { useInterviewOptionsDialog } from "../hooks/interview.js"
import { Link, useNavigate } from "@tanstack/react-router"
import { useCartPricingResult, useCurrentCart } from "../hooks/cart.js"

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

export const AccessCodePage = () => {
  const { eventId, accessCode } = accessCodeRoute.useParams()
  const event = useEvent(eventId)
  const accessCodeResult = useAccessCodeCheck(eventId, accessCode)

  if (!accessCodeResult) {
    return (
      <Title title="Not Found">
        <Text component="p">
          The access code was not found. It may have been already used or
          expired.
        </Text>
      </Title>
    )
  }

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

const Registrations = ({
  event,
  accessCode,
}: {
  event: Event
  accessCode?: string | null
}) => {
  const registrations = useRegistrations(event.id, accessCode)
  const navigate = useNavigate()
  const [currentCart] = useCurrentCart(event.id)
  const currentPricingResult = useCartPricingResult(currentCart.id)

  const interviewOptions = useInterviewOptionsDialog(
    event.id,
    currentCart.id,
    accessCode,
  )

  return (
    <>
      <MTitle order={4}>{event.title}</MTitle>
      <Text component="p">These are your registrations for {event.title}.</Text>
      <Divider />
      <RegistrationList
        registrations={registrations.registrations.map((r) => ({
          key: r.id,
          title: r.title,
          subtitle: r.subtitle,
          description: r.description,
          menuItems: r.change_options?.map((o) => ({
            label: o.title,
            onClick: () => {
              navigate({
                to: changeRegistrationRoute.to,
                hash: accessCode ? `a=${accessCode}` : undefined,
                params: {
                  eventId: event.id,
                  registrationId: r.id,
                  interviewId: o.id,
                },
              })
            },
          })),
        }))}
      />
      <Spacer flex={{ base: "auto", xs: "auto", sm: "none" }} />
      {interviewOptions.options.length > 0 && (
        <Grid justify="space-between">
          <Grid.Col span={{ base: 12, xs: 12, sm: "content" }}>
            <Button
              fullWidth
              leftSection={<IconPlus />}
              onClick={interviewOptions.show}
            >
              Add Registration
            </Button>
          </Grid.Col>
          {currentPricingResult.registrations.length > 0 && (
            <Grid.Col span={{ base: 12, xs: 12, sm: "content" }}>
              <Button
                fullWidth
                variant="subtle"
                component={Link}
                to={cartRoute.to}
              >
                View cart{" "}
                {currentPricingResult.registrations.length > 1 &&
                  ` (${currentPricingResult.registrations.length}) `}
                &raquo;
              </Button>
            </Grid.Col>
          )}
        </Grid>
      )}
      <OptionsDialog
        title="Add Registration"
        opened={interviewOptions.opened}
        options={interviewOptions.options}
        onClose={() => interviewOptions.close()}
        onSelect={(id) => interviewOptions.select(id)}
      />
    </>
  )
}
