import { CartAPI } from "#src/features/cart/index.js"
import { PaymentAPI } from "#src/features/payment/index.js"
import { SelfServiceAPI } from "#src/features/selfservice/index.js"
import { AuthStore } from "#src/api/auth.js"
import { AuthAPI } from "#src/api/types.js"
import { createOptionalContext } from "#src/utils.js"
import {
  InterviewAPI,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { QueryClient } from "@tanstack/react-query"
import { Config } from "#src/types.js"

export interface AppContextValue {
  config: Config
  queryClient: QueryClient
  interviewAPI: InterviewAPI
  interviewStore: InterviewResponseStore
  authAPI: AuthAPI
  authStore: AuthStore
  cartAPI: CartAPI
  selfServiceAPI: SelfServiceAPI
  paymentAPI: PaymentAPI
}

export const AppContext = createOptionalContext<AppContextValue>()
