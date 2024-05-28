import { ReactNode } from "react"

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

export type PaymentContext<S extends string = string> = (
  | {
      id: string
      result: PaymentResult<S> | null
    }
  | { id: null; result: null }
) & {
  submitting: boolean
  setSubmitting(submitting: boolean): void
  error: string | null
  setError(error: string | null): void
  update(
    body: S extends keyof PaymentRequestBodyMap
      ? PaymentRequestBodyMap[S]
      : Record<string, unknown>,
  ): Promise<PaymentResult<S>>
  cancel(): Promise<PaymentResult<S>>
}

export type PaymentServiceComponentProps = {
  children: {
    Content: () => ReactNode
    Controls: () => ReactNode
  }
}
