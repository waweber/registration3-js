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
  AuthAPIContext,
  AuthContext,
  AuthProvider,
  AuthStore,
  InterviewRecordLocalStorage,
  createAuthAPI,
  isNotFound,
  isResponseError,
  makeCartAPI,
  useCreateAuth,
  useSetupAuth,
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

// TODO:
import exampleLogo from "@open-event-systems/registration-common/example-logo.svg"

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

  const [authStore, authAPI] = useCreateAuth("http://localhost:8000")

  const [authWretch] = useState(() =>
    wretch("http://localhost:8000").middlewares([authStore.authMiddleware]),
  )

  const setupAuth = useSetupAuth(authStore, authAPI)

  const [cartAPI] = useState(() => makeCartAPI(authWretch))
  const [paymentAPI] = useState(() => makePaymentAPI(authWretch))
  const [interviewAPI] = useState(() => makeInterviewAPI())
  const [interviewStore] = useState(() => InterviewRecordLocalStorage.load())

  const [selfServiceAPI] = useState(() => makeSelfServiceAPI(authWretch))

  useEffect(() => {
    setupAuth()
  }, [setupAuth])

  return (
    <MantineProvider
      theme={{
        ...DEFAULT_THEME,
        components: {
          Logo: {
            defaultProps: {
              src: exampleLogo,
            },
          },
        },
      }}
      forceColorScheme="light"
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider api={authAPI} store={authStore}>
          <CartAPIProvider cartAPI={cartAPI}>
            <PaymentAPIContext.Provider value={paymentAPI}>
              <InterviewAPIProvider api={interviewAPI} store={interviewStore}>
                <SelfServiceAPIContext.Provider value={selfServiceAPI}>
                  <FullscreenLoader>
                    <RouterProvider
                      router={router}
                      context={{
                        authStore: authStore,
                        authAPI: authAPI,
                      }}
                    />
                  </FullscreenLoader>
                </SelfServiceAPIContext.Provider>
              </InterviewAPIProvider>
            </PaymentAPIContext.Provider>
          </CartAPIProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  )
}
