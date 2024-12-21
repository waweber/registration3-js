import { authRoute } from "#src/app/routes/auth.js"
import {
  getCurrentCartQueryOptions,
  getPricingResultQueryOptions,
} from "@open-event-systems/registration-lib/cart"
import {
  getSelfServiceAccessCodeCheckQueryOptions,
  getSelfServiceEventsQueryOptions,
  getSelfServiceRegistrationsQueryOptions,
} from "@open-event-systems/registration-lib/selfservice"
import {
  createRoute,
  lazyRouteComponent,
  notFound,
} from "@tanstack/react-router"

export const eventRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "events/$eventId",
  async loader({ context, params }) {
    const { eventId } = params
    const { queryClient, selfServiceAPI } = context
    const options = getSelfServiceEventsQueryOptions(selfServiceAPI)
    const events = await queryClient.fetchQuery(options)

    const event = events.get(eventId)
    if (!event) {
      throw notFound()
    }
    return event
  },
})

export const selfServiceLayoutRoute = createRoute({
  getParentRoute: () => eventRoute,
  id: "selfServiceLayout",
  component: lazyRouteComponent(
    () =>
      import("#src/features/selfservice/components/SelfServiceLayoutRoute.js"),
  ),
})

export const selfServiceRegistrationsRoute = createRoute({
  getParentRoute: () => selfServiceLayoutRoute,
  path: "/",
  async loader({ context, params }) {
    const { selfServiceAPI, cartAPI, currentCartStore, queryClient } = context
    const { eventId } = params
    const currentCart = await queryClient.fetchQuery(
      getCurrentCartQueryOptions(
        cartAPI,
        currentCartStore,
        queryClient,
        eventId,
      ),
    )
    const [pricingResult, registrations] = await Promise.all([
      queryClient.fetchQuery(
        getPricingResultQueryOptions(cartAPI, currentCart.id),
      ),
      queryClient.fetchQuery(
        getSelfServiceRegistrationsQueryOptions(
          selfServiceAPI,
          eventId,
          currentCart.id,
        ),
      ),
    ])

    return {
      pricingResult,
      registrations,
    }
  },
  pendingComponent: lazyRouteComponent(
    () => import("#src/features/selfservice/components/RegistrationsRoute.js"),
    "RegistrationsPendingRoute",
  ),
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/RegistrationsRoute.js"),
    "RegistrationsRoute",
  ),
})

export const accessCodeRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "access-code/$accessCode",
  async loader({ context, params }) {
    const { selfServiceAPI, cartAPI, currentCartStore, queryClient } = context
    const { eventId, accessCode } = params

    const [checkResult, currentCart] = await Promise.all([
      queryClient.fetchQuery(
        getSelfServiceAccessCodeCheckQueryOptions(
          selfServiceAPI,
          eventId,
          accessCode,
        ),
      ),
      queryClient.fetchQuery(
        getCurrentCartQueryOptions(
          cartAPI,
          currentCartStore,
          queryClient,
          eventId,
        ),
      ),
    ])

    if (!checkResult) {
      throw notFound()
    }

    const [pricingResult, registrations] = await Promise.all([
      queryClient.fetchQuery(
        getPricingResultQueryOptions(cartAPI, currentCart.id),
      ),
      queryClient.fetchQuery(
        getSelfServiceRegistrationsQueryOptions(
          selfServiceAPI,
          eventId,
          currentCart.id,
          accessCode,
        ),
      ),
    ])

    return {
      registrations,
      pricingResult,
    }
  },
  notFoundComponent: lazyRouteComponent(
    () => import("#src/features/selfservice/components/AccessCodeRoute.js"),
    "AccessCodeNotFoundRoute",
  ),
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/AccessCodeRoute.js"),
    "AccessCodeRoute",
  ),
})
