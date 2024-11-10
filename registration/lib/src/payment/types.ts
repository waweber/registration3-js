export const PAYMENT_STATUS = {
  pending: "pending",
  completed: "completed",
  canceled: "canceled",
} as const

export type PaymentStatus = keyof typeof PAYMENT_STATUS

/**
 * Payment method type.
 */
export type PaymentMethod = {
  id: string
  name: string
}

/**
 * Map of payment service IDs.
 */
export interface PaymentServiceMap {}

/**
 * Payment service IDs.
 */
export type PaymentServiceID = keyof PaymentServiceMap

/**
 * Maps service IDs to payment request body types.
 */
export interface PaymentRequestBodyMap {}

export type PaymentRequestBody<S extends PaymentServiceID = PaymentServiceID> =
  S extends keyof PaymentRequestBodyMap
    ? PaymentRequestBodyMap[S]
    : Record<string, unknown>

/**
 * Maps service IDs to payment result body types.
 */
export interface PaymentResultBodyMap {}

export type PaymentResultBody<S extends PaymentServiceID = PaymentServiceID> =
  S extends keyof PaymentResultBodyMap
    ? PaymentResultBodyMap[S]
    : Record<string, unknown>

/**
 * A payment result.
 */
export type PaymentResult<S extends PaymentServiceID = PaymentServiceID> = {
  id: string
  service: S
  status: PaymentStatus
  body: PaymentResultBody<S>
}

export type PaymentAPI = {
  getPaymentMethods(cartId: string): Promise<PaymentMethod[]>
  createPayment(cartId: string, method: string): Promise<PaymentResult>
  updatePayment<S extends PaymentServiceID = PaymentServiceID>(
    paymentId: string,
    body: PaymentRequestBody<S>,
  ): Promise<PaymentResult<S>>
  cancelPayment<S extends PaymentServiceID = PaymentServiceID>(
    paymentId: string,
  ): Promise<PaymentResult<S>>
}

export type PaymentManager<S extends PaymentServiceID = PaymentServiceID> = (
  | {
      payment: null
      update: () => Promise<null>
      cancel: () => Promise<null>
    }
  | {
      payment: PaymentResult<S> | null
      update: (body: PaymentRequestBody<S>) => Promise<PaymentResult<S>>
      cancel: () => Promise<PaymentResult<S>>
    }
) & {
  error: string | null
  setError: (error: string | null) => void
  submitting: boolean
  setSubmitting: (submitting: boolean) => void
  close: () => void
}
