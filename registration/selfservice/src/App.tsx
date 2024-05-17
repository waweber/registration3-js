import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router.js"
import { DEFAULT_THEME, MantineProvider } from "@mantine/core"

import "@mantine/core/styles.css"
import "@open-event-systems/registration-common/styles.scss"
import "./styles.scss"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const App = () => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <MantineProvider theme={DEFAULT_THEME} forceColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  )
}
