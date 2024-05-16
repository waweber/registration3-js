import { createBrowserHistory, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routes/index.js"
import { FullscreenLoader } from "@open-event-systems/registration-common"

export const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  defaultPendingComponent() {
    return <FullscreenLoader />
  },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
