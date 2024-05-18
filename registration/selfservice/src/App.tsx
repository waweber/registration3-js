import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router.js"
import { DEFAULT_THEME, MantineProvider } from "@mantine/core"

import "@mantine/core/styles.css"
import "@open-event-systems/interview-components/styles.scss"
import "@open-event-systems/registration-common/styles.scss"
import "./styles.scss"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FullscreenLoader } from "@open-event-systems/registration-common/components"
import {
  isNotFoundError,
  makeMockCartAPI,
} from "@open-event-systems/registration-common"
import { CartAPIProvider } from "./providers/cart.js"
import { InterviewAPIProvider, mockAPI } from "./providers/interview.js"

export const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry(failureCount, error) {
              return !isNotFoundError(error) && failureCount < 3
            },
          },
        },
      }),
  )
  const [cartAPI] = useState(() => makeMockCartAPI())
  const [interviewAPI] = useState(() => mockAPI)
  return (
    <MantineProvider theme={DEFAULT_THEME} forceColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <CartAPIProvider cartAPI={cartAPI}>
          <InterviewAPIProvider interviewAPI={interviewAPI}>
            <FullscreenLoader>
              <RouterProvider router={router} />
            </FullscreenLoader>
          </InterviewAPIProvider>
        </CartAPIProvider>
      </QueryClientProvider>
    </MantineProvider>
  )
}
