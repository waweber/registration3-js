import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router"

import logoSrc from "@open-event-systems/registration-common/example-logo.svg"
import {
  SimpleLayout,
  Title,
} from "@open-event-systems/registration-common/components"
import { RegistrationsPage } from "./RegistrationsPage.js"
import { AddRegistrationPage, ChangeRegistrationPage } from "./InterviewPage.js"
import { CartPage } from "./CartPage.js"

export const rootRoute = createRootRoute({
  component() {
    return (
      <SimpleLayout
        AppShellLayoutProps={{
          TitleAreaProps: {
            LogoProps: {
              src: logoSrc,
            },
          },
        }}
      >
        <Title title="Registration">
          <Outlet />
        </Title>
      </SimpleLayout>
    )
  },
  notFoundComponent() {
    return <>Not found</>
  },
  errorComponent() {
    return <>Error</>
  },
})

export const eventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId",
})

export const registrationsRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "/",
  component: RegistrationsPage,
})

export const addRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/add/$interviewId",
  component: AddRegistrationPage,
})

export const changeRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/change/$registrationId/$interviewId",
  component: ChangeRegistrationPage,
})

export const cartRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart",
  component: CartPage,
})

export const routeTree = rootRoute.addChildren([
  eventRoute.addChildren([
    registrationsRoute,
    addRegistrationRoute,
    changeRegistrationRoute,
    cartRoute,
  ]),
])
