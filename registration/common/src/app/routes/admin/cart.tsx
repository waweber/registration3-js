import { adminEventRoute } from "#src/app/routes/admin/admin.js"
import {
  getCurrentCartQueryOptions,
  getPricingResultQueryOptions,
} from "@open-event-systems/registration-lib/cart"
import { getPaymentMethodsQueryOptions } from "@open-event-systems/registration-lib/payment"
import { getRegistrationSearchQueryOptions } from "@open-event-systems/registration-lib/registration"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const adminCartRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "cart",
  async loader({ context, params }) {
    const {
      queryClient,
      cartAPI,
      currentCartStore,
      registrationAPI,
      paymentAPI,
    } = context
    const { eventId } = params

    const currentCart = await queryClient.fetchQuery(
      getCurrentCartQueryOptions(
        cartAPI,
        currentCartStore,
        queryClient,
        eventId,
      ),
    )

    const registrations = await queryClient.fetchInfiniteQuery(
      getRegistrationSearchQueryOptions(registrationAPI, eventId, "", {
        cart_id: currentCart.id,
      }),
    )

    const [pricingResult, paymentOptions] = await Promise.all([
      queryClient.fetchQuery(
        getPricingResultQueryOptions(cartAPI, currentCart.id),
      ),
      queryClient.fetchQuery(
        getPaymentMethodsQueryOptions(paymentAPI, currentCart.id),
      ),
    ])

    return {
      registrations,
      pricingResult,
      paymentOptions,
    }
  },
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/CartRoute.js"),
    "CartRoute",
  ),
})
