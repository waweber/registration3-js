import { eventRoute } from "#src/app/routes/selfservice/registrations.js"
import { getCartQueryOptions } from "#src/features/cart/api.js"
import { getPaymentQueryOptions } from "#src/features/payment/index.js"
import { getSelfServiceQueryOptions } from "#src/features/selfservice/api.js"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const cartRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart",
  async loader({ context, params }) {
    const { queryClient, selfServiceAPI, paymentAPI } = context
    const { eventId } = params
    const cartQueries = getCartQueryOptions(context)
    const selfServiceQueries = getSelfServiceQueryOptions(selfServiceAPI)
    const paymentQueries = getPaymentQueryOptions(paymentAPI)

    const currentCart = await queryClient.fetchQuery(
      cartQueries.currentCart(eventId),
    )
    const registrations = await queryClient.fetchQuery(
      selfServiceQueries.registrations(eventId),
    )

    const [pricingResult, paymentOptions] = await Promise.all([
      queryClient.fetchQuery(cartQueries.cartPricingResult(currentCart.id)),
      queryClient.fetchQuery(paymentQueries.paymentMethods(currentCart.id)),
    ])

    return {
      registrations,
      pricingResult,
      paymentOptions,
    }
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/CartRoute.js"),
    "CartRoute",
  ),
  notFoundComponent: lazyRouteComponent(
    () => import("#src/features/selfservice/components/CartRoute.js"),
    "CartNotFound",
  ),
})

export const addRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/add/$interviewId",
  async loader({ context, params, location }) {
    const { queryClient } = context
    const { eventId, interviewId } = params
    const hashParams = new URLSearchParams(location.hash)
    const accessCode = hashParams.get("a")
    const stateId = hashParams.get("s")

    const queries = getCartQueryOptions(context)

    if (stateId) {
      return await queryClient.fetchQuery(queries.interviewRecord(stateId))
    } else {
      const currentCart = await queryClient.fetchQuery(
        queries.currentCart(eventId),
      )
      const initialRecord = await queryClient.fetchQuery({
        ...queries.initialInterviewRecord(
          eventId,
          currentCart.id,
          interviewId,
          null,
          accessCode,
        ),
      })
      return initialRecord
    }
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/InterviewRoute.js"),
    "AddRegistrationRoute",
  ),
})

export const changeRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/change/$registrationId/$interviewId",
  async loader({ context, params, location }) {
    const { queryClient } = context
    const { eventId, interviewId, registrationId } = params
    const hashParams = new URLSearchParams(location.hash)
    const accessCode = hashParams.get("a")
    const stateId = hashParams.get("s")

    const queries = getCartQueryOptions(context)

    if (stateId) {
      return await queryClient.fetchQuery(queries.interviewRecord(stateId))
    } else {
      const currentCart = await queryClient.fetchQuery(
        queries.currentCart(eventId),
      )
      return await queryClient.fetchQuery(
        queries.initialInterviewRecord(
          eventId,
          currentCart.id,
          interviewId,
          registrationId,
          accessCode,
        ),
      )
    }
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/InterviewRoute.js"),
    "ChangeRegistrationRoute",
  ),
})
