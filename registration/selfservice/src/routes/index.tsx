import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router"

import logoSrc from "@open-event-systems/registration-common/example-logo.svg"
import {
  AlertProvider,
  SelfServiceLayout,
  Title,
  UserMenu,
  useTitle,
} from "@open-event-systems/registration-common/components"
import { AccessCodePage, RegistrationsPage } from "./RegistrationsPage.js"
import { AddRegistrationPage, ChangeRegistrationPage } from "./InterviewPage.js"
import { CartPage } from "./CartPage.js"
import { observer } from "mobx-react-lite"
import { useContext } from "react"
import { useAuth } from "@open-event-systems/registration-common"

export const rootRoute = createRootRoute({
  component: observer(() => {
    const [title, subtitle] = useTitle()
    const auth = useAuth()
    return (
      <SelfServiceLayout
        logoSrc={logoSrc}
        homeHref="/"
        title={title}
        subtitle={subtitle}
      >
        <Title title="Registration">
          <AlertProvider>
            <Outlet />
          </AlertProvider>
        </Title>
      </SelfServiceLayout>
    )
  }),
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

export const accessCodeRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "access-code/$accessCode",
  component: AccessCodePage,
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
    accessCodeRoute,
    cartRoute,
  ]),
])
