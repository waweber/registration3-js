import {
  AlertProvider,
  OptionsDialog,
  SelfServiceLayout,
  Spacer,
  Title,
  UserMenu,
  useTitle,
} from "@open-event-systems/registration-common/components"
import { rootRoute, signInMenuRoute } from "./index.js"
import { Event } from "../api/types.js"
import { RegistrationList } from "../components/registration/RegistrationList.js"
import { Suspense, useEffect, useRef } from "react"
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
import {
  Link,
  Outlet,
  createRoute,
  notFound,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router"
import { observer } from "mobx-react-lite"
import { saveToken, useAuth } from "@open-event-systems/registration-common"
import { getSelfServiceQueryOptions } from "../api/queries.js"
import { getCartQueryOptions } from "../cart/queries.js"
import { useRegistrations } from "../hooks/api.js"
import { useCartPricingResult, useCurrentCart } from "../cart/hooks.js"
import { cartRoute } from "./CartPage.js"
import { changeRegistrationRoute } from "./InterviewPage.js"

const changedRegistrationsKey = "oes-changed-registrations"

export const eventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "events/$eventId",
  async beforeLoad({ context, location }) {
    const { authStore } = context
    await authStore.ready
    if (!authStore.token) {
      authStore.returnURL = location.href
      throw redirect({ to: signInMenuRoute.to })
    }
  },
  async loader({ context, params }) {
    const { eventId } = params
    const { queryClient, selfServiceAPI } = context
    const selfServiceQueries = getSelfServiceQueryOptions(selfServiceAPI)
    const events = await queryClient.fetchQuery(selfServiceQueries.events)

    const event = events.get(eventId)
    if (!event) {
      throw notFound()
    }
    return event
  },
  component: observer(() => {
    const [title, subtitle] = useTitle()
    const auth = useAuth()
    const loc = useLocation()
    return (
      <SelfServiceLayout
        title={title}
        subtitle={subtitle}
        homeHref="/"
        userMenu={
          <UserMenu
            userName={auth.token?.email}
            onSignIn={() => {
              auth.returnURL = loc.pathname
              window.location.href = signInMenuRoute.to
            }}
            onSignOut={() => {
              saveToken(null)
              window.location.reload()
            }}
            signInOptions={[{ id: "sign-in", label: "Sign In" }]}
          />
        }
      >
        <Title title="Registration">
          <AlertProvider>
            <Outlet />
          </AlertProvider>
        </Title>
      </SelfServiceLayout>
    )
  }),
})

export const registrationsRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "/",
  async loader({ context, params }) {
    const { selfServiceAPI, queryClient } = context
    const { eventId } = params
    const queries = getSelfServiceQueryOptions(selfServiceAPI)
    const cartQueries = getCartQueryOptions(context)
    const currentCart = await queryClient.fetchQuery(
      cartQueries.currentCart(eventId),
    )

    const [pricingResult, registrations] = await Promise.all([
      queryClient.fetchQuery(cartQueries.cartPricingResult(currentCart.id)),
      queryClient.fetchQuery(queries.registrations(eventId)),
    ])

    return {
      pricingResult,
      registrations,
    }
  },
  pendingComponent() {
    return (
      <Title title="Registrations" subtitle="View and manage registrations">
        <RegistrationList.Placeholder />
      </Title>
    )
  },
  component() {
    const event = eventRoute.useLoaderData()
    return (
      <Title title="Registrations" subtitle="View and manage registrations">
        <Suspense fallback={<RegistrationList.Placeholder />}>
          <Registrations event={event} />
        </Suspense>
      </Title>
    )
  },
})

export const accessCodeRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "access-code/$accessCode",
  async loader({ context, params }) {
    const { selfServiceAPI, queryClient } = context
    const { eventId, accessCode } = params
    const queries = getSelfServiceQueryOptions(selfServiceAPI)
    const cartQueries = getCartQueryOptions(context)

    const [checkResult, currentCart] = await Promise.all([
      queryClient.fetchQuery(queries.accessCodeCheck(eventId, accessCode)),
      queryClient.fetchQuery(cartQueries.currentCart(eventId)),
    ])

    if (!checkResult) {
      throw notFound()
    }

    const [pricingResult, registrations] = await Promise.all([
      queryClient.fetchQuery(cartQueries.cartPricingResult(currentCart.id)),
      queryClient.fetchQuery(queries.registrations(eventId)),
    ])

    return {
      registrations,
      pricingResult,
    }
  },
  notFoundComponent() {
    return (
      <Title title="Not Found">
        <Text component="p">
          The access code was not found. It may have been already used or
          expired.
        </Text>
      </Title>
    )
  },
  component() {
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
  },
})

const Registrations = ({
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
