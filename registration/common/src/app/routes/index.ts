import { AppContextValue } from "#src/app/context.js"
import { createRootRouteWithContext } from "@tanstack/react-router"

export const rootRoute = createRootRouteWithContext<AppContextValue>()({
  pendingMinMs: 0, // required or it shows blank page for defaultPendingMinMs...
})
