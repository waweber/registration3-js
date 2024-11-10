import {
  PaymentAPIContext,
  PaymentManagerContext,
} from "#src/payment/providers.js"
import { getPaymentMethodsQueryOptions } from "#src/payment/queries.js"
import {
  PaymentAPI,
  PaymentManager,
  PaymentMethod,
  PaymentRequestBody,
  PaymentResult,
  PaymentServiceID,
} from "#src/payment/types.js"
import { isResponseError, useRequiredContext } from "#src/utils.js"
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
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
 * Get an object to manage payment lifecycle.
 */
export const usePaymentManager = <
  S extends PaymentServiceID = PaymentServiceID,
>({
  payment,
  onError,
  onComplete,
  onClose,
}: {
  payment: PaymentResult<S> | null | undefined
  onError?: (error: unknown) => void
  onComplete?: () => void
  onClose?: () => void
}): PaymentManager<S> => {
  const paymentAPI = usePaymentAPI()
  const queryClient = useQueryClient()

  const submitCountRef = useRef(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useMutation({
    mutationKey: ["payments", payment?.id],
    async mutationFn({ body }: { body: PaymentRequestBody<S> }) {
      if (payment?.id) {
        return await paymentAPI.updatePayment(payment.id, body)
      } else {
        return null
      }
    },
    onSuccess(res) {
      if (payment?.id) {
        queryClient.setQueryData(["payments", payment.id], res)
      }
    },
  })

  const cancel = useMutation({
    mutationKey: ["payments", payment?.id],
    async mutationFn() {
      if (payment?.id) {
        return await paymentAPI.cancelPayment<S>(payment.id)
      } else {
        return null
      }
    },
    onSuccess(res) {
      if (payment?.id) {
        queryClient.setQueryData(["payments", payment.id], res)
      }
    },
  })

  const setSubmittingCb = useCallback((submitting: boolean) => {
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
  }, [])

  const updateCb = useCallback(
    async (body: PaymentRequestBody<S>) => {
      if (!payment) {
        return null
      }
      setSubmittingCb(true)
      setError(null)

      try {
        const res = await update.mutateAsync({ body })
        setSubmittingCb(false)
        if (onComplete) {
          onComplete()
        }
        return res
      } catch (e) {
        console.error(e)
        setSubmittingCb(false)
        if (isResponseError(e)) {
          if (e.json?.message) {
            setError(e.json.message)
          } else {
            setError(e.name)
          }
        } else {
          setError(String(e))
        }
        onError && onError(e)
        return payment
      }
    },
    [payment, update.mutateAsync, setSubmittingCb, onError],
  )

  const cancelCb = useCallback(async () => {
    if (!payment) {
      return null
    }

    if (payment.status != "pending") {
      return payment
    } else {
      return await cancel.mutateAsync()
    }
  }, [payment, cancel.mutateAsync])

  const closeCb = useCallback(() => {
    cancelCb()
    onClose && onClose()
  }, [cancelCb, onClose])

  return {
    payment: payment,
    error,
    setError,
    submitting,
    setSubmitting: setSubmittingCb,
    update: updateCb,
    cancel: cancelCb,
    close: closeCb,
  } as PaymentManager<S>
}

export const usePaymentManagerContext = <
  S extends PaymentServiceID = PaymentServiceID,
>(): PaymentManager<S> => {
  return useRequiredContext(PaymentManagerContext) as PaymentManager<S>
}
