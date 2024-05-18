import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router"

import logoSrc from "@open-event-systems/registration-common/example-logo.svg"
import {
  SimpleLayout,
  Title,
} from "@open-event-systems/registration-common/components"
import { RegistrationsPage } from "./RegistrationsPage.js"

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
  component: RegistrationsPage,
})

export const routeTree = rootRoute.addChildren([eventRoute])
