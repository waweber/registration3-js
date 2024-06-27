import { CartAPI } from "#src/features/cart"
import { PaymentAPI } from "#src/features/payment"
import { SelfServiceAPI } from "#src/features/selfservice"
import { AuthStore } from "#src/api/auth"
import { AuthAPI } from "#src/api/types"
import { createOptionalContext } from "#src/utils"
import {
  InterviewAPI,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { QueryClient } from "@tanstack/react-query"
import { Config } from "#src/types"

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
