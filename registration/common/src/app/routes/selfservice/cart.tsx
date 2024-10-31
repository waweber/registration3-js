import { selfServiceLayoutRoute } from "#src/app/routes/selfservice/registrations.js"
import { getPaymentQueryOptions } from "#src/features/payment/index.js"
import { getDefaultUpdateURL } from "#src/utils.js"
import {
  getCurrentCartQueryOptions,
  getPricingResultQueryOptions,
} from "@open-event-systems/registration-lib/cart"
import { getInterviewStateQueryOptions } from "@open-event-systems/registration-lib/interview"
import { getSelfServiceRegistrationsQueryOptions } from "@open-event-systems/registration-lib/selfservice"
import {
  createRoute,
  lazyRouteComponent,
  notFound,
} from "@tanstack/react-router"

export const cartRoute = createRoute({
  getParentRoute: () => selfServiceLayoutRoute,
  path: "cart",
  async loader({ context, params }) {
    const {
      queryClient,
      selfServiceAPI,
      cartAPI,
      currentCartStore,
      paymentAPI,
    } = context
    const { eventId } = params
    const paymentQueries = getPaymentQueryOptions(paymentAPI)

    const currentCart = await queryClient.fetchQuery(
      getCurrentCartQueryOptions(
        cartAPI,
        currentCartStore,
        queryClient,
        eventId,
      ),
    )
    const registrations = await queryClient.fetchQuery(
      getSelfServiceRegistrationsQueryOptions(
        selfServiceAPI,
        eventId,
        currentCart.id,
      ),
    )

    const [pricingResult, paymentOptions] = await Promise.all([
      queryClient.fetchQuery(
        getPricingResultQueryOptions(cartAPI, currentCart.id),
      ),
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
    const { queryClient, interviewAPI, interviewStore } = context
    const hashParams = new URLSearchParams(location.hash)
    const stateId = hashParams.get("s")

    if (stateId) {
      return await queryClient.fetchQuery(
        getInterviewStateQueryOptions(
          interviewAPI,
          interviewStore,
          getDefaultUpdateURL(),
          stateId,
        ),
      )
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
    const { queryClient, interviewAPI, interviewStore } = context
    const hashParams = new URLSearchParams(location.hash)
    const stateId = hashParams.get("s")

    if (stateId) {
      return await queryClient.fetchQuery(
        getInterviewStateQueryOptions(
          interviewAPI,
          interviewStore,
          getDefaultUpdateURL(),
          stateId,
        ),
      )
    } else {
      throw notFound()
    }
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/InterviewRoute.js"),
    "ChangeRegistrationRoute",
  ),
})
