import { AuthProvider } from "#src/api/AuthProvider"
import { AuthStore } from "#src/api/auth"
import { createAuthAPI } from "#src/api/authApi"
import { AppContext, AppContextValue } from "#src/app/context"
import { makeRouter } from "#src/app/router"
import { makeCartAPI } from "#src/features/cart/api"
import { PaymentAPIContext, makePaymentAPI } from "#src/features/payment"
import { makeSelfServiceAPI } from "#src/features/selfservice/api"
import { useSetupAuth } from "#src/hooks/auth"
import { InterviewRecordLocalStorage } from "#src/interview/store"
import { Config } from "#src/types"
import { InterviewAPIProvider } from "@open-event-systems/interview-components"
import { makeInterviewAPI } from "@open-event-systems/interview-lib"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import wretch from "wretch"

import "@open-event-systems/interview-components/styles.scss"
import "../styles.scss"

const App = ({ config }: { config: Config }) => {
  const [ctx] = useState((): AppContextValue => {
    const authAPI = createAuthAPI(wretch(config.apiURL))
    const authStore = new AuthStore(
      authAPI,
      new URL(config.apiURL, window.location.href).origin,
    )

    const authWretch = wretch(config.apiURL).middlewares([
      authStore.authMiddleware,
    ])

    return {
      config,
      authAPI,
      authStore,
      queryClient: new QueryClient(),
      cartAPI: makeCartAPI(authWretch),
      paymentAPI: makePaymentAPI(authWretch),
      interviewAPI: makeInterviewAPI(),
      interviewStore: InterviewRecordLocalStorage.load(),
      selfServiceAPI: makeSelfServiceAPI(authWretch),
    }
  })

  const setupAuth = useSetupAuth(ctx.authStore, ctx.authAPI)

  useEffect(() => {
    setupAuth()
  }, [])

  const [router] = useState(() => {
    return makeRouter(ctx)
  })

  return (
    <AppContext.Provider value={ctx}>
      <AuthProvider api={ctx.authAPI} store={ctx.authStore}>
        <QueryClientProvider client={ctx.queryClient}>
          <InterviewAPIProvider
            api={ctx.interviewAPI}
            store={ctx.interviewStore}
          >
            <PaymentAPIContext.Provider value={ctx.paymentAPI}>
              <RouterProvider router={router} />
            </PaymentAPIContext.Provider>
          </InterviewAPIProvider>
        </QueryClientProvider>
      </AuthProvider>
    </AppContext.Provider>
  )
}

export default App
