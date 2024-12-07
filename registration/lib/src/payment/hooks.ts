import {
  PaymentAPIContext,
  PaymentManagerContext,
} from "#src/payment/providers.js"
import {
  getPaymentMethodsQueryOptions,
  getRegistrationPaymentsQueryOptions,
} from "#src/payment/queries.js"
import {
  PaymentAPI,
  PaymentManager,
  PaymentMethod,
  PaymentRequestBody,
  PaymentResult,
  PaymentSearchResult,
  PaymentServiceID,
} from "#src/payment/types.js"
import { isResponseError, useRequiredContext } from "#src/utils.js"
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useCallback, useRef, useState } from "react"

export const usePaymentAPI = (): PaymentAPI =>
  useRequiredContext(PaymentAPIContext)

export const usePaymentMethods = (cartId: string): PaymentMethod[] => {
  const paymentAPI = usePaymentAPI()
  const query = useSuspenseQuery(
    getPaymentMethodsQueryOptions(paymentAPI, cartId),
  )
  return query.data
}

/**
 * Get a function to create a payment.
 */
export const useCreatePayment = (
  cartId: string,
): ((method: string) => Promise<PaymentResult>) => {
  const paymentAPI = usePaymentAPI()
  const queryClient = useQueryClient()
  const mutate = useMutation({
    mutationKey: ["carts", cartId, "create-payment"],
    async mutationFn(method: string) {
      return await paymentAPI.createPayment(cartId, method)
    },
    onSuccess(res) {
      queryClient.setQueryData(["payments", res.id], res)
    },
  })
  return mutate.mutateAsync
}

/**
 * Get a payment.
 */
export const usePayment = <S extends PaymentServiceID = PaymentServiceID>(
  paymentId: string | null | undefined,
): PaymentResult<S> | null => {
  const query = useQuery<PaymentResult<S>>({
    queryKey: ["payments", paymentId],
    enabled: false,
    staleTime: Infinity,
  })

  return query.data ?? null
}

/**
 * Get a registration's payments.
 */
export const useRegistrationPayments = (
  eventId: string,
  registrationId: string,
): PaymentSearchResult[] => {
  const paymentAPI = usePaymentAPI()
  const opts = getRegistrationPaymentsQueryOptions(
    paymentAPI,
    eventId,
    registrationId,
  )
  const query = useSuspenseQuery(opts)
  return query.data
}

/**
 * Get an object to manage payment lifecycle.
 */
export const usePaymentManager = <
  S extends PaymentServiceID = PaymentServiceID,
>({
  payment,
  onUpdate,
  onClose,
}: {
  payment: PaymentResult<S> | null | undefined
  onUpdate?: (result: PaymentResult<S>) => Promise<void> | void
  onClose?: (manager: PaymentManager<S>) => void
}): PaymentManager<S> => {
  const paymentId = payment?.id
  const paymentAPI = usePaymentAPI()
  const queryClient = useQueryClient()

  const submitCountRef = useRef(0)
  const [submitting, setSubmitting] = useState(false)

  const setSubmittingCb = useCallback(
    (submitting: boolean) => {
      if (submitting) {
        submitCountRef.current += 1
        if (submitCountRef.current == 1) {
          setSubmitting(true)
        }
      } else {
        submitCountRef.current -= 1
        if (submitCountRef.current == 0) {
          setSubmitting(false)
        }
      }
    },
    [submitCountRef, setSubmitting],
  )

  const [error, setError] = useState<string | null>(null)

  const updateMutation = useMutation({
    mutationKey: ["payments", payment?.id],
    async mutationFn(body: PaymentRequestBody<S>) {
      if (!paymentId) {
        throw new Error("No payment")
      }
      return await paymentAPI.updatePayment(paymentId, body)
    },
    onSuccess(res) {
      queryClient.setQueryData(["payments", res.id], res)
    },
  })

  const updateCb = useCallback(
    async (body: PaymentRequestBody<S>) => {
      setSubmitting(true)
      try {
        const res = await updateMutation.mutateAsync(body)
        if (onUpdate) {
          await onUpdate(res)
        }
        setSubmitting(false)
        return res
      } catch (e) {
        setSubmitting(false)
        if (isResponseError(e)) {
          if (e.json?.message) {
            setError(e.json.message)
          } else {
            setError(e.message)
          }
        } else {
          setError(String(e))
        }
        throw e
      }
    },
    [updateMutation.mutateAsync, setSubmitting, onUpdate, setError],
  )

  const cancelMutation = useMutation({
    mutationKey: ["payments", paymentId, "cancel"],
    async mutationFn(): Promise<PaymentResult<S>> {
      if (!paymentId) {
        throw new Error("No payment")
      }
      return await paymentAPI.cancelPayment(paymentId)
    },
    onSuccess(res) {
      queryClient.setQueryData(["payments", res.id], res)
    },
  })

  const cancelCb = useCallback(async () => {
    const res = await cancelMutation.mutateAsync()
    if (onUpdate) {
      await onUpdate(res)
    }
    return res
  }, [cancelMutation.mutateAsync, onUpdate])

  const mgr = {
    payment: payment || null,
    submitting,
    setSubmitting: setSubmittingCb,
    error,
    setError,
    update: updateCb,
    cancel: cancelCb,
    close: useCallback(() => {
      if (onClose) {
        onClose(mgr)
      }
    }, [onClose]),
  }
  return mgr
}

export const usePaymentManagerContext = <
  S extends PaymentServiceID = PaymentServiceID,
>(): PaymentManager<S> => {
  return useRequiredContext(PaymentManagerContext) as PaymentManager<S>
}
