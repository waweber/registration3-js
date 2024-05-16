import { SimpleLayout, Title } from "@open-event-systems/registration-common"
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router"

import logoSrc from "@open-event-systems/registration-common/example-logo.svg"

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
