import {
  SimpleLayout,
  Title,
} from "@open-event-systems/registration-components"
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router"

import logoSrc from "@open-event-systems/registration-components/example-logo.svg"

export const rootRoute = createRootRoute()

export const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
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
  }),
])
