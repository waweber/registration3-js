import { createRootRouteWithContext, createRoute } from "@tanstack/react-router"

import {
  accessCodeRoute,
  eventRoute,
  registrationsRoute,
} from "./RegistrationsPage.js"
import {
  addRegistrationRoute,
  changeRegistrationRoute,
} from "./InterviewPage.js"
import {
  NotFound,
  SignInEmailRoute,
  SignInMenuRoute,
  SignInRoute,
  SignInWebAuthnRegisterRoute,
} from "@open-event-systems/registration-common"
import { AppContextValue } from "../appContext.js"
import { eventsRoute } from "./EventsPage.js"
import { cartRoute } from "./CartPage.js"

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
