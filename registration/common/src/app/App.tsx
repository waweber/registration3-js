import { AuthProvider } from "#src/api/AuthProvider.js"
import { AuthStore } from "#src/api/auth.js"
import { createAuthAPI } from "#src/api/authApi.js"
import { AppContext, AppContextValue } from "#src/app/context.js"
import { makeRouter } from "#src/app/router.js"
import { makeCartAPI } from "#src/features/cart/api.js"
import {
  PaymentAPIContext,
  makePaymentAPI,
} from "#src/features/payment/index.js"
import { makeSelfServiceAPI } from "#src/features/selfservice/api.js"
import { useSetupAuth } from "#src/hooks/auth.js"
import { InterviewRecordLocalStorage } from "#src/interview/store.js"
import { Config } from "#src/types.js"
import { InterviewAPIProvider } from "@open-event-systems/interview-components"
import { makeInterviewAPI } from "@open-event-systems/interview-lib"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import wretch from "wretch"

import "@open-event-systems/interview-components/styles.scss"
import "../styles.scss"
import { createRegistrationAPI } from "#src/features/registration/api.js"
import { RegistrationAPIContext } from "#src/features/registration/queries.js"

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
      registrationAPI: createRegistrationAPI(authWretch),
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
              <RegistrationAPIContext.Provider value={ctx.registrationAPI}>
                <RouterProvider router={router} />
              </RegistrationAPIContext.Provider>
            </PaymentAPIContext.Provider>
          </InterviewAPIProvider>
        </QueryClientProvider>
      </AuthProvider>
    </AppContext.Provider>
  )
}

export default App
