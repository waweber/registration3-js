import { AppContextValue } from "#src/app/context"
import { authRoute } from "#src/app/routes/auth"
import { rootRoute } from "#src/app/routes/index"
import {
  addRegistrationRoute,
  cartRoute,
  changeRegistrationRoute,
} from "#src/app/routes/selfservice/cart"
import { eventsRoute } from "#src/app/routes/selfservice/events"
import {
  eventRoute,
  selfServiceRegistrationsRoute,
} from "#src/app/routes/selfservice/registrations"
import {
  signInEmailRoute,
  signInMenuRoute,
  signInRoute,
  webAuthnRegisterRoute,
} from "#src/app/routes/signin"
import { FullscreenLoader } from "#src/components/index"
import { createBrowserHistory, createRouter } from "@tanstack/react-router"

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof makeRouter>
  }
}

export const makeRouter = (ctx: AppContextValue) => {
  return createRouter({
    history: createBrowserHistory(),
    context: ctx,
    defaultPendingComponent: FullscreenLoader.Show,
    routeTree: rootRoute.addChildren([
      signInRoute.addChildren([
        signInMenuRoute,
        signInEmailRoute,
        webAuthnRegisterRoute,
      ]),
      authRoute.addChildren([
        eventsRoute,
        eventRoute.addChildren([
          selfServiceRegistrationsRoute,
          cartRoute,
          addRegistrationRoute,
          changeRegistrationRoute,
        ]),
      ]),
    ]),
  })
}
