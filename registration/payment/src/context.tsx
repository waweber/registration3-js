import { ReactNode, createContext, useContext, useState } from "react"
import { PaymentContext, PaymentResult } from "./types.js"
import { usePaymentAPI } from "./api.js"
import {
  useIsFetching,
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"

const PaymentCtx = createContext<PaymentContext | null>(null)

export const usePaymentContext = <
  S extends string = string,
>(): PaymentContext<S> => {
  const ctx = useContext(PaymentCtx)
  if (!ctx) {
    throw new Error("Payment context not provided")
  }
  return ctx as PaymentContext<S>
}

export const PaymentContextProvider = ({
  children,
  paymentId,
  payment,
}: {
  paymentId?: string | null
  payment?: PaymentResult | null
  children?: ReactNode
}) => {
  const paymentAPI = usePaymentAPI()
  const fetching = useIsFetching({ queryKey: ["payments", paymentId] })
  const mutating = useIsMutating({ mutationKey: ["payments", paymentId] })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const update = useMutation({
    mutationKey: ["payments", paymentId, "update"],
    async mutationFn({ body }: { body: Record<string, unknown> }) {
      return await paymentAPI.updatePayment(paymentId ?? "", body)
    },
    onSuccess(data) {
      queryClient.setQueryData(["payments", paymentId], data)
    },
  })

  const cancel = useMutation({
    mutationKey: ["payments", paymentId, "cancel"],
    async mutationFn() {
      return await paymentAPI.cancelPayment(paymentId ?? "")
    },
    onSuccess(data) {
      queryClient.setQueryData(["payments", paymentId], data)
    },
  })

  const showSubmitting = fetching > 0 || mutating > 0 || submitting

  const idAndRes = paymentId
    ? { id: paymentId, result: payment ?? null }
    : { id: null, result: null }

  const ctx: PaymentContext = {
    ...idAndRes,
    submitting: showSubmitting,
    setSubmitting,
    error,
    setError,
    async update(body) {
      try {
        return await update.mutateAsync({ body: body })
      } catch (e) {
        setError(String(e))
        return this.result as PaymentResult
      }
    },
    async cancel() {
      try {
        return await cancel.mutateAsync()
      } catch (e) {
        setError(String(e))
        return this.result as PaymentResult
      }
    },
  }

  return <PaymentCtx.Provider value={ctx}>{children}</PaymentCtx.Provider>
}
