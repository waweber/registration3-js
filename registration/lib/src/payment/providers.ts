import {
  PaymentAPI,
  PaymentManager,
  PaymentServiceID,
} from "#src/payment/types.js"
import { createOptionalContext } from "#src/utils.js"
import { createElement, ReactNode } from "react"

export const PaymentAPIContext = createOptionalContext<PaymentAPI>()
export const PaymentAPIProvider = PaymentAPIContext.Provider

export const PaymentManagerContext = createOptionalContext<PaymentManager>()
export const PaymentManagerProvider = <
  S extends PaymentServiceID = PaymentServiceID,
>({
  value,
  children,
}: {
  value: PaymentManager<S>
  children?: ReactNode
}) => {
  return createElement(PaymentManagerContext.Provider, {
    value: value as PaymentManager,
    children,
  })
}
