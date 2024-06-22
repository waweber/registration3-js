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
  AuthProvider,
  AuthStore,
  InterviewRecordLocalStorage,
  createAuthAPI,
  isNotFound,
  isResponseError,
  makeCartAPI,
  useSetupAuth,
} from "@open-event-systems/registration-common"
import { InterviewAPIProvider } from "@open-event-systems/interview-components"
import wretch from "wretch"
import { makeSelfServiceAPI } from "./api/api.js"
import { makeInterviewAPI } from "@open-event-systems/interview-lib"
import {
  PaymentAPIContext,
  makePaymentAPI,
} from "@open-event-systems/registration-payment"

// TODO:
import exampleLogo from "@open-event-systems/registration-common/example-logo.svg"
import { AppContext, AppContextValue } from "./appContext.js"

export const App = () => {
  const [appCtx] = useState((): AppContextValue => {
    const queryClient = new QueryClient({
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
    })

    const baseURL = "http://localhost:8000" // TODO
    const authAPI = createAuthAPI(wretch(baseURL))
    const authStore = new AuthStore(authAPI, new URL(baseURL).origin)

    const authWretch = wretch(baseURL.toString()).middlewares([
      authStore.authMiddleware,
    ])

    const cartAPI = makeCartAPI(authWretch)
    const paymentAPI = makePaymentAPI(authWretch)
    const interviewAPI = makeInterviewAPI()
    const interviewStore = InterviewRecordLocalStorage.load()
    const selfServiceAPI = makeSelfServiceAPI(authWretch)

    return {
      queryClient,
      authAPI,
      authStore,
      cartAPI,
      paymentAPI,
      interviewAPI,
      interviewStore,
      selfServiceAPI,
    }
  })

  const setupAuth = useSetupAuth(appCtx.authStore, appCtx.authAPI)

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
      <AppContext.Provider value={appCtx}>
        <QueryClientProvider client={appCtx.queryClient}>
          <AuthProvider api={appCtx.authAPI} store={appCtx.authStore}>
            <InterviewAPIProvider
              api={appCtx.interviewAPI}
              store={appCtx.interviewStore}
            >
              <PaymentAPIContext.Provider value={appCtx.paymentAPI}>
                <FullscreenLoader>
                  <RouterProvider router={router} context={appCtx} />
                </FullscreenLoader>
              </PaymentAPIContext.Provider>
            </InterviewAPIProvider>
          </AuthProvider>
        </QueryClientProvider>
      </AppContext.Provider>
    </MantineProvider>
  )
}
