import { AppContextValue } from "#src/app/context.js"
import { adminEventRoute, adminRoute } from "#src/app/routes/admin.js"
import { authRoute } from "#src/app/routes/auth.js"
import { deviceAuthAuthorizeRoute } from "#src/app/routes/device/authorize.js"
import { deviceAuthRoute } from "#src/app/routes/device/device.js"
import { rootRoute } from "#src/app/routes/index.js"
import { registrationSearchRoute } from "#src/app/routes/registration/search.js"
import {
  addRegistrationRoute,
  cartRoute,
  changeRegistrationRoute,
} from "#src/app/routes/selfservice/cart.js"
import { eventsRoute } from "#src/app/routes/selfservice/events.js"
import {
  accessCodeRoute,
  eventRoute,
  selfServiceLayoutRoute,
  selfServiceRegistrationsRoute,
} from "#src/app/routes/selfservice/registrations.js"
import {
  signInEmailRoute,
  signInMenuRoute,
  signInRoute,
  webAuthnRegisterRoute,
} from "#src/app/routes/signin.js"
import { FullscreenLoader } from "#src/components/index.js"
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
        deviceAuthRoute,
      ]),
      authRoute.addChildren([
        deviceAuthAuthorizeRoute,
        eventsRoute,
        eventRoute.addChildren([
          selfServiceLayoutRoute.addChildren([
            selfServiceRegistrationsRoute,
            cartRoute,
            addRegistrationRoute,
            changeRegistrationRoute,
          ]),
          accessCodeRoute,
        ]),
        adminRoute.addChildren([
          adminEventRoute.addChildren([registrationSearchRoute]),
        ]),
      ]),
    ]),
  })
}
