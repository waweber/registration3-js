import {
  OptionsDialog,
  Title,
} from "@open-event-systems/registration-common/components"
import { cartRoute, changeRegistrationRoute, eventRoute } from "./index.js"
import { useEvent, useRegistrations } from "../hooks/api.js"
import { Event } from "../api/types.js"
import { RegistrationList } from "../components/registration/RegistrationList.js"
import { Suspense } from "react"
import { Box, Button, Grid } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
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

const Registrations = ({ event }: { event: Event }) => {
  const registrations = useRegistrations(event.id)
  const navigate = useNavigate()
  const [currentCart] = useCurrentCart(event.id)
  const currentPricingResult = useCartPricingResult(currentCart.id)

  const interviewOptions = useInterviewOptionsDialog(event.id, currentCart.id)

  return (
    <>
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
      <Box flex={{ base: "auto", xs: "auto", sm: "initial" }} />
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
