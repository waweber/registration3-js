import {
  InterviewAPI,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import {
  AuthAPI,
  AuthStore,
  CartAPI,
  useRequiredContext,
} from "@open-event-systems/registration-common"
import { PaymentAPI } from "@open-event-systems/registration-payment"
import { QueryClient } from "@tanstack/react-query"
import { SelfServiceAPI } from "./api/types.js"
import { createContext } from "react"

export interface AppContextValue {
  queryClient: QueryClient
  authStore: AuthStore
  authAPI: AuthAPI
  cartAPI: CartAPI
  paymentAPI: PaymentAPI
  interviewAPI: InterviewAPI
  interviewStore: InterviewResponseStore
  selfServiceAPI: SelfServiceAPI
}

export const AppContext = createContext<Readonly<AppContextValue> | null>(null)

export const useApp = (): Readonly<AppContextValue> =>
  useRequiredContext(AppContext)
