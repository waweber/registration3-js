import { ComponentType, ReactNode } from "react"

export type PaymentMethod = {
  id: string
  name: string
}

export const PAYMENT_STATUS = {
  pending: "pending",
  completed: "completed",
  canceled: "canceled",
} as const

export type PaymentStatus = keyof typeof PAYMENT_STATUS

/**
 * Maps service IDs to payment request body types.
 */
export interface PaymentRequestBodyMap {}

/**
 * Maps service IDs to payment result body types.
 */
export interface PaymentResultBodyMap {}

export type PaymentResult<S extends string = string> = {
  id: string
  service: S
  status: PaymentStatus
  body: S extends keyof PaymentResultBodyMap
    ? PaymentResultBodyMap[S]
    : Record<string, unknown>
}

export type PaymentAPI = {
  getPaymentMethods(cartId: string): Promise<PaymentMethod[]>
  createPayment(cartId: string, method: string): Promise<PaymentResult>
  updatePayment(
    paymentId: string,
    body: Record<string, unknown>,
  ): Promise<PaymentResult>
  cancelPayment(paymentId: string): Promise<PaymentResult>
}

export type PaymentServiceRenderProps = {
  content?: ReactNode
  controls?: ReactNode
}

export type PaymentServiceComponentProps = {
  children: (renderProps: PaymentServiceRenderProps) => ReactNode
}

export type PaymentServiceComponent =
  ComponentType<PaymentServiceComponentProps>
