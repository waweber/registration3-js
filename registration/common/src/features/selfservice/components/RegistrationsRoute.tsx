import { useEffect, useRef } from "react"
import { Button, Grid, Text, Title as MTitle, Divider } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { RegistrationList } from "#src/features/selfservice/components/index"
import {
  useInterviewOptionsDialog,
  useRegistrations,
} from "#src/features/selfservice/hooks"
import { useCartPricingResult, useCurrentCart } from "#src/features/cart/hooks"
import { Event } from "#src/features/selfservice/types"
import { OptionsDialog, Spacer, Title } from "#src/components/index"
import { eventRoute } from "#src/app/routes/selfservice/registrations"
import {
  cartRoute,
  changeRegistrationRoute,
} from "#src/app/routes/selfservice/cart"

const changedRegistrationsKey = "oes-changed-registrations"

export const RegistrationsRoute = () => {
  const event = eventRoute.useLoaderData()
  return (
    <Title title="Registrations" subtitle="View and manage registrations">
      <Registrations event={event} />
    </Title>
  )
}

export const RegistrationsPendingRoute = () => (
  <Title title="Registrations" subtitle="View and manage registrations">
    <RegistrationList.Placeholder />
  </Title>
)

export const Registrations = ({
  event,
  accessCode,
}: {
  event: Event
  accessCode?: string | null
}) => {
  const navigate = useNavigate()
  const registrations = useRegistrations(event.id, accessCode)
  const [currentCart] = useCurrentCart(event.id)
  const currentPricingResult = useCartPricingResult(currentCart.id)

  const interviewOptions = useInterviewOptionsDialog(event.id, accessCode)

  const changedRegistrations = getChangedRegistrations() ?? []
  const changedRegistrationsRef = useRef(changedRegistrations)

  useEffect(() => {
    const curIds = registrations.registrations.map((r) => r.id)
    setChangedRegistrations(
      changedRegistrations.filter((id) => !curIds.includes(id)),
    )
    changedRegistrationsRef.current = [
      ...changedRegistrationsRef.current,
      ...changedRegistrations.filter(
        (id) => !changedRegistrationsRef.current.includes(id),
      ),
    ]
  }, [registrations, changedRegistrations])

  return (
    <>
      <MTitle order={4}>{event.title}</MTitle>
      <Text component="p">These are your registrations for {event.title}.</Text>
      <Divider />
      <RegistrationList
        registrations={registrations.registrations.map((r, i) => ({
          key: r.id,
          title: r.title,
          subtitle: r.subtitle,
          description: r.description,
          headerColor: r.header_color,
          headerImage: r.header_image,
          new: changedRegistrationsRef.current.includes(r.id),
          n: i,
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

export const setChangedRegistrations = (ids: string[]) => {
  window.sessionStorage.setItem(changedRegistrationsKey, JSON.stringify(ids))
}

export const getChangedRegistrations = (): string[] | null => {
  const dataStr = window.sessionStorage.getItem(changedRegistrationsKey)
  if (!dataStr) {
    return null
  }
  return JSON.parse(dataStr)
}
