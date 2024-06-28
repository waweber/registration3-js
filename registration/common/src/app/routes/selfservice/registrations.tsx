import { authRoute } from "#src/app/routes/auth.js"
import { getCartQueryOptions } from "#src/features/cart/api.js"
import { getSelfServiceQueryOptions } from "#src/features/selfservice/api.js"
import {
  createRoute,
  lazyRouteComponent,
  notFound,
} from "@tanstack/react-router"
import { lazy } from "react"

export const eventRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "events/$eventId",
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
  component: lazy(
    () =>
      import("#src/features/selfservice/components/SelfServiceLayoutRoute.js"),
  ),
})

export const selfServiceRegistrationsRoute = createRoute({
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
  notFoundComponent: lazyRouteComponent(
    () => import("#src/features/selfservice/components/AccessCodeRoute.js"),
    "AccessCodeNotFound",
  ),
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/AccessCodeRoute.js"),
    "AccessCodeRoute",
  ),
})
