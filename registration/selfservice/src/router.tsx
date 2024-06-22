import { createBrowserHistory, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routes/index.js"
import { FullscreenLoader } from "@open-event-systems/registration-common/components"
import { AppContextValue } from "./appContext.js"

export const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  defaultPendingComponent: FullscreenLoader.Show,
  context: undefined as unknown as AppContextValue,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
