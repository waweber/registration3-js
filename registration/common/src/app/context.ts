import { AuthStore } from "#src/api/auth.js"
import { AuthAPI } from "#src/api/types.js"
import { createOptionalContext } from "#src/utils.js"
import {
  InterviewAPI,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { QueryClient } from "@tanstack/react-query"
import { Config } from "#src/types.js"
import {
  CartAPI,
  CurrentCartStore,
} from "@open-event-systems/registration-lib/cart"
import { SelfServiceAPI } from "@open-event-systems/registration-lib/selfservice"
import { PaymentAPI } from "@open-event-systems/registration-lib/payment"
import { RegistrationAPI } from "@open-event-systems/registration-lib/registration"

export interface AppContextValue {
  config: Config
  queryClient: QueryClient
  interviewAPI: InterviewAPI
  interviewStore: InterviewResponseStore
  authAPI: AuthAPI
  authStore: AuthStore
  cartAPI: CartAPI
  currentCartStore: CurrentCartStore
  selfServiceAPI: SelfServiceAPI
  paymentAPI: PaymentAPI
  registrationAPI: RegistrationAPI
}

export const AppContext = createOptionalContext<AppContextValue>()
