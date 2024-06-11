import { createBrowserHistory, createRouter } from "@tanstack/react-router"
import { RouterContext, routeTree } from "./routes/index.js"
import { FullscreenLoader } from "@open-event-systems/registration-common/components"

export const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  defaultPendingComponent: FullscreenLoader.Show,
  context: undefined as unknown as RouterContext,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
