import { selfServiceLayoutRoute } from "#src/app/routes/selfservice/registrations.js"
import { getCartQueryOptions } from "#src/features/cart/api.js"
import { getPaymentQueryOptions } from "#src/features/payment/index.js"
import { getSelfServiceQueryOptions } from "#src/features/selfservice/api.js"
import { isResponseError } from "#src/utils.js"
import {
  InterviewResponseRecord,
  getErrorResponse,
} from "@open-event-systems/interview-lib"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

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
  getParentRoute: () => selfServiceLayoutRoute,
  path: "cart/add/$interviewId",
  async loader({ context, params, location }) {
    const { queryClient, interviewStore } = context
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
      try {
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
      } catch (e) {
        if (isResponseError(e)) {
          // a hack...
          const errResp = getErrorResponse(new Date().toISOString(), e.status)
          return interviewStore.add(errResp)
        } else {
          throw e
        }
      }
    }
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/InterviewRoute.js"),
    "AddRegistrationRoute",
  ),
})

export const changeRegistrationRoute = createRoute({
  getParentRoute: () => selfServiceLayoutRoute,
  path: "cart/change/$registrationId/$interviewId",
  async loader({ context, params, location }) {
    const { queryClient, interviewStore } = context
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
      try {
        return await queryClient.fetchQuery(
          queries.initialInterviewRecord(
            eventId,
            currentCart.id,
            interviewId,
            registrationId,
            accessCode,
          ),
        )
      } catch (e) {
        if (isResponseError(e)) {
          // a hack...
          const errResp = getErrorResponse(new Date().toISOString(), e.status)
          return interviewStore.add(errResp)
        } else {
          throw e
        }
      }
    }
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/InterviewRoute.js"),
    "ChangeRegistrationRoute",
  ),
})
