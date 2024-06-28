import { AppContextValue } from "#src/app/context.js"
import { createRootRouteWithContext } from "@tanstack/react-router"

export const rootRoute = createRootRouteWithContext<AppContextValue>()({})
