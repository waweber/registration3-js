import { createRootRouteWithContext, createRoute } from "@tanstack/react-router"

import {
  accessCodeRoute,
  eventRoute,
  registrationsRoute,
} from "./RegistrationsPage.js"
import { AddRegistrationPage, ChangeRegistrationPage } from "./InterviewPage.js"
import { CartPage } from "./CartPage.js"
import {
  NotFound,
  SignInEmailRoute,
  SignInMenuRoute,
  SignInRoute,
  SignInWebAuthnRegisterRoute,
} from "@open-event-systems/registration-common"
import { AppContextValue } from "../appContext.js"
import { getCartQueryOptions } from "../cart/queries.js"
import { eventsRoute } from "./EventsPage.js"

export type RouterContext = AppContextValue

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  notFoundComponent() {
    return <NotFound />
  },
})

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignInRoute,
  notFoundComponent: SignInRoute.NotFound,
})

export const signInMenuRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "/",
  component: SignInMenuRoute,
})

export const signInEmailRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "email",
  component: SignInEmailRoute,
})

export const webAuthnRegisterRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "webauthn-register",
  component: SignInWebAuthnRegisterRoute,
})

export const addRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/add/$interviewId",
  component: AddRegistrationPage,
  async loader({ context, params, location }) {
    const { queryClient } = context
    const { eventId, interviewId } = params
    const hashParams = new URLSearchParams(location.hash)
    const accessCode = hashParams.get("a")
    const stateId = hashParams.get("s")

    const queries = getCartQueryOptions(context)

    if (stateId) {
      return await queryClient.ensureQueryData(queries.interviewRecord(stateId))
    } else {
      const currentCart = await queryClient.ensureQueryData(
        queries.currentCart(eventId),
      )
      return await queryClient.ensureQueryData(
        queries.initialInterviewRecord(
          eventId,
          currentCart.id,
          interviewId,
          null,
          accessCode,
        ),
      )
    }
  },
})

export const changeRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/change/$registrationId/$interviewId",
  component: ChangeRegistrationPage,
  async loader({ context, params, location }) {
    const { queryClient } = context
    const { eventId, interviewId, registrationId } = params
    const hashParams = new URLSearchParams(location.hash)
    const accessCode = hashParams.get("a")
    const stateId = hashParams.get("s")

    const queries = getCartQueryOptions(context)

    if (stateId) {
      return await queryClient.ensureQueryData(queries.interviewRecord(stateId))
    } else {
      const currentCart = await queryClient.ensureQueryData(
        queries.currentCart(eventId),
      )
      return await queryClient.ensureQueryData(
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
})

export const cartRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart",
  component: CartPage,
})

export const routeTree = rootRoute.addChildren([
  eventsRoute,
  eventRoute.addChildren([
    registrationsRoute,
    addRegistrationRoute,
    changeRegistrationRoute,
    accessCodeRoute,
    cartRoute,
  ]),
  signInRoute.addChildren([
    signInMenuRoute,
    signInEmailRoute,
    webAuthnRegisterRoute,
  ]),
])
