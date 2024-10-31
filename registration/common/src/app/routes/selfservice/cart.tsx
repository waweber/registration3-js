import { selfServiceLayoutRoute } from "#src/app/routes/selfservice/registrations.js"
import { getCartQueryOptions } from "#src/features/cart/api.js"
import { getPaymentQueryOptions } from "#src/features/payment/index.js"
import { getSelfServiceQueryOptions } from "#src/features/selfservice/api.js"
import { isResponseError } from "#src/utils.js"
import {
  InterviewResponseRecord,
  getErrorResponse,
} from "@open-event-systems/interview-lib"
import {
  createRoute,
  lazyRouteComponent,
  notFound,
} from "@tanstack/react-router"

export const cartRoute = createRoute({
  getParentRoute: () => selfServiceLayoutRoute,
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
      selfServiceQueries.registrations(eventId, currentCart.id),
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
  getParentRoute: () => selfServiceLayoutRoute,
  path: "cart/add",
  async loader({ context, location }) {
    const { queryClient } = context
    const hashParams = new URLSearchParams(location.hash)
    const stateId = hashParams.get("s")
    const queries = getCartQueryOptions(context)

    if (stateId) {
      return await queryClient.fetchQuery(queries.interviewRecord(stateId))
    } else {
      throw notFound()
    }
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/InterviewRoute.js"),
    "AddRegistrationRoute",
  ),
})

export const changeRegistrationRoute = createRoute({
  getParentRoute: () => selfServiceLayoutRoute,
  path: "cart/change",
  async loader({ context, location }) {
    const { queryClient } = context
    const hashParams = new URLSearchParams(location.hash)
    const stateId = hashParams.get("s")

    const queries = getCartQueryOptions(context)

    if (stateId) {
      return await queryClient.fetchQuery(queries.interviewRecord(stateId))
    } else {
      throw notFound()
    }
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/InterviewRoute.js"),
    "ChangeRegistrationRoute",
  ),
})
