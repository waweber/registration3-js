import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import {
  PaymentRequestBodyMap,
  PaymentResult,
  PaymentServiceComponent,
} from "../types.js"
import { usePaymentAPI } from "../api.js"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getPaymentComponent } from "../services/index.js"
import { PaymentPlaceholder } from "../components/payment/Payment.js"
import { isResponseError } from "@open-event-systems/registration-common"

export type PaymentHookOptions<S extends string = string> = {
  paymentId?: string | null
  result?: PaymentResult<S> | null
  onClose?: () => void
}

export type PaymentHook<S extends string = string> = (
  | { paymentId?: null; result: null }
  | { paymentId: string; result: PaymentResult<S> | null }
) & {
  error: string | null
  setError: (error: string | null) => void
  submitting: boolean
  setSubmitting: (submitting: boolean) => void
  update: (
    body: S extends keyof PaymentRequestBodyMap
      ? PaymentRequestBodyMap[S]
      : Record<string, unknown>,
  ) => Promise<PaymentResult<S>>
  cancel: () => Promise<PaymentResult<S>>
  close: () => void
  Component: PaymentServiceComponent
}

export const usePayment = <S extends string = string>({
  paymentId,
  result,
  onClose,
}: PaymentHookOptions<S>): PaymentHook<S> => {
  const paymentAPI = usePaymentAPI()
  const queryClient = useQueryClient()
  const [submitting, setSubmitting] = useState(false)
  const submitCountRef = useRef(0)
  const [error, setError] = useState<string | null>(null)
  const [componentContainer, setComponentContainer] = useState<{
    readonly service: string
    readonly Component: PaymentServiceComponent
  }>(placeholder)

  const idAndRes = paymentId
    ? { paymentId, result: result ?? null }
    : { paymentId: null, result: null }

  const isSubmitting = submitting

  const update = useMutation({
    mutationKey: ["payments", paymentId, "update"],
    async mutationFn({ body }: { body: Record<string, unknown> }) {
      return await paymentAPI.updatePayment(paymentId ?? "", body)
    },
    onSuccess(res) {
      queryClient.setQueryData(["payments", paymentId], res)
    },
  })

  const cancel = useMutation({
    mutationKey: ["payments", paymentId, "cancel"],
    async mutationFn() {
      return await paymentAPI.cancelPayment(paymentId ?? "")
    },
    onSuccess(res) {
      queryClient.setQueryData(["payments", paymentId], res)
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

      if (submitCountRef.current <= 0) {
        setSubmitting(false)
      }
    }
  }, [])

  const cancelFunc = useCallback(async () => {
    const curPayment = queryClient.getQueryData<PaymentResult<S>>([
      "payments",
      paymentId,
    ])

    if (!paymentId || !curPayment) {
      throw new Error("No payment")
    }

    let res = curPayment

    if (curPayment.status == "pending") {
      res = (await cancel.mutateAsync()) as PaymentResult<S>
    }

    return res
  }, [paymentId, cancel])

  useLayoutEffect(() => {
    if (result?.service && result.service != componentContainer.service) {
      getPaymentComponent(result.service).then((r) => {
        setComponentContainer(r)
      })
    }
  }, [result?.service, componentContainer.service])

  return {
    ...idAndRes,
    submitting: isSubmitting,
    setSubmitting: setSubmittingCb,
    error,
    setError,
    update: useCallback(
      async (body) => {
        if (!paymentId) {
          throw new Error("No payment")
        }

        setSubmittingCb(true)
        setError(null)
        try {
          const res = await update.mutateAsync({ body })
          setSubmittingCb(false)
          return res as PaymentResult<S>
        } catch (e) {
          setSubmittingCb(false)
          if (isResponseError(e)) {
            setError(JSON.parse(e.message).message)
          } else {
            setError(String(e))
          }
          throw e
        }
      },
      [paymentId, update],
    ),
    cancel: cancelFunc,
    close: useCallback(() => {
      cancelFunc().catch(() => null)
      onClose && onClose()
    }, [onClose, cancelFunc]),
    Component:
      componentContainer.service == result?.service
        ? componentContainer.Component
        : placeholder.Component,
  }
}

export const PaymentContext = createContext<PaymentHook | null>(null)

export const usePaymentContext = <
  S extends string = string,
>(): PaymentHook<S> => {
  const ctx = useContext(PaymentContext)
  if (!ctx) {
    throw new Error("No payment")
  }
  return ctx as unknown as PaymentHook<S>
}

const placeholder = { service: "", Component: PaymentPlaceholder } as const
