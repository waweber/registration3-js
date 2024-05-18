import { createBrowserHistory, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routes/index.js"
import { FullscreenLoader } from "@open-event-systems/registration-common/components"

export const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  defaultPendingComponent: FullscreenLoader.Show,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
