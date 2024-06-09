import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router.js"
import { DEFAULT_THEME, MantineProvider } from "@mantine/core"

import "@mantine/core/styles.css"
import "@open-event-systems/interview-components/styles.scss"
import "@open-event-systems/registration-common/styles.scss"
import "./styles.scss"
import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FullscreenLoader } from "@open-event-systems/registration-common/components"
import {
  AuthContext,
  AuthStore,
  InterviewRecordLocalStorage,
  createAuthAPI,
  isNotFound,
  isResponseError,
  makeCartAPI,
} from "@open-event-systems/registration-common"
import { CartAPIProvider } from "./providers/cart.js"
import { InterviewAPIProvider } from "@open-event-systems/interview-components"
import wretch from "wretch"
import { makeSelfServiceAPI } from "./api/api.js"
import { SelfServiceAPIContext } from "./hooks/api.js"
import { makeInterviewAPI } from "@open-event-systems/interview-lib"
import {
  PaymentAPIContext,
  makePaymentAPI,
} from "@open-event-systems/registration-payment"

export const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry(failureCount, error) {
              if (
                isNotFound(error) ||
                (isResponseError(error) && error.status == 401)
              ) {
                return false
              }
              return failureCount < 3
            },
          },
        },
      }),
  )

  const [authAPI] = useState(() =>
    createAuthAPI(wretch("http://localhost:8000")),
  )
  const [authStore] = useState(
    () => new AuthStore(authAPI, "http://localhost:8000"),
  )
  const [authWretch] = useState(() =>
    wretch("http://localhost:8000").middlewares([authStore.authMiddleware]),
  )

  const [cartAPI] = useState(() => makeCartAPI(authWretch))
  const [paymentAPI] = useState(() => makePaymentAPI(authWretch))
  const [interviewAPI] = useState(() => makeInterviewAPI())
  const [interviewStore] = useState(() => InterviewRecordLocalStorage.load())

  const [selfServiceAPI] = useState(() => makeSelfServiceAPI(authWretch))

  useEffect(() => {
    authStore.load()
  }, [authStore])

  return (
    <MantineProvider theme={DEFAULT_THEME} forceColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authStore}>
          <CartAPIProvider cartAPI={cartAPI}>
            <PaymentAPIContext.Provider value={paymentAPI}>
              <InterviewAPIProvider api={interviewAPI} store={interviewStore}>
                <SelfServiceAPIContext.Provider value={selfServiceAPI}>
                  <FullscreenLoader>
                    <RouterProvider router={router} />
                  </FullscreenLoader>
                </SelfServiceAPIContext.Provider>
              </InterviewAPIProvider>
            </PaymentAPIContext.Provider>
          </CartAPIProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </MantineProvider>
  )
}
