import { AppContextValue } from "#src/app/context"
import { createRootRouteWithContext } from "@tanstack/react-router"

export const rootRoute = createRootRouteWithContext<AppContextValue>()({})
