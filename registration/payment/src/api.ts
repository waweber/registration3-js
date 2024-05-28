import { createContext, useContext } from "react"
import { PaymentAPI } from "./types.js"

export const PaymentAPIContext = createContext<PaymentAPI | null>(null)

export const usePaymentAPI = (): PaymentAPI => {
  const ctx = useContext(PaymentAPIContext)
  if (!ctx) {
    throw new Error("Payment API not provided")
  }
  return ctx
}
