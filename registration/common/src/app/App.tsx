import { AuthProvider } from "#src/api/AuthProvider.js"
import { AuthStore } from "#src/api/auth.js"
import { createAuthAPI } from "#src/api/authApi.js"
import { AppContext, AppContextValue } from "#src/app/context.js"
import { makeRouter } from "#src/app/router.js"
import { useSetupAuth } from "#src/hooks/auth.js"
import { InterviewRecordLocalStorage } from "#src/interview/store.js"
import { Config } from "#src/types.js"
import { makeInterviewAPI } from "@open-event-systems/interview-lib"
import {
  CartAPIProvider,
  CookieCurrentCartStore,
  CurrentCartStoreProvider,
  makeCartAPI,
} from "@open-event-systems/registration-lib/cart"
import {
  makeSelfServiceAPI,
  SelfServiceAPIProvider,
} from "@open-event-systems/registration-lib/selfservice"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import wretch from "wretch"

import "@open-event-systems/interview-components/styles.scss"
import "../styles.scss"
import {
  InterviewAPIProvider,
  InterviewStoreProvider,
} from "@open-event-systems/registration-lib/interview"
import {
  makePaymentAPI,
  PaymentAPIProvider,
} from "@open-event-systems/registration-lib/payment"
import {
  makeMockRegistrationAPI,
  makeRegistrationAPI,
  RegistrationAPIProvider,
} from "@open-event-systems/registration-lib/registration"

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
      currentCartStore: new CookieCurrentCartStore(),
      paymentAPI: makePaymentAPI(authWretch),
      interviewAPI: makeInterviewAPI(),
      interviewStore: InterviewRecordLocalStorage.load(),
      selfServiceAPI: makeSelfServiceAPI(authWretch),
      registrationAPI: makeRegistrationAPI(authWretch),
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
          <InterviewAPIProvider value={ctx.interviewAPI}>
            <InterviewStoreProvider value={ctx.interviewStore}>
              <CartAPIProvider value={ctx.cartAPI}>
                <CurrentCartStoreProvider value={ctx.currentCartStore}>
                  <PaymentAPIProvider value={ctx.paymentAPI}>
                    <SelfServiceAPIProvider value={ctx.selfServiceAPI}>
                      <RegistrationAPIProvider value={ctx.registrationAPI}>
                        <RouterProvider router={router} />
                      </RegistrationAPIProvider>
                    </SelfServiceAPIProvider>
                  </PaymentAPIProvider>
                </CurrentCartStoreProvider>
              </CartAPIProvider>
            </InterviewStoreProvider>
          </InterviewAPIProvider>
        </QueryClientProvider>
      </AuthProvider>
    </AppContext.Provider>
  )
}

export default App
