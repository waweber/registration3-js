import {
  getPaymentQueryOptions,
  usePaymentAPI,
} from "#src/features/payment/index.js"
import {
  PaymentMethod,
  PaymentRequestBodyMap,
  PaymentResult,
  PaymentServiceComponent,
} from "#src/features/payment/index.js"
import { PaymentPlaceholder } from "#src/features/payment/components/index.js"
import { getPaymentComponent } from "#src/features/payment/services/index.js"
import {
  UseOptionsDialogHook,
  UseOptionsDialogOptions,
  useOptionsDialog,
} from "#src/hooks/options.js"
import {
  createOptionalContext,
  isResponseError,
  useRequiredContext,
} from "#src/utils.js"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useCallback, useLayoutEffect, useRef, useState } from "react"

export const usePaymentMethods = (cartId: string): PaymentMethod[] => {
  const paymentAPI = usePaymentAPI()
  const queries = getPaymentQueryOptions(paymentAPI)
  const methodsQuery = useSuspenseQuery(queries.paymentMethods(cartId))
  return methodsQuery.data
}

export type UsePaymentMethodsDialogOptions = {
  cartId: string
} & Omit<UseOptionsDialogOptions, "options">

export const usePaymentMethodsDialog = ({
  cartId,
  ...other
}: UsePaymentMethodsDialogOptions): UseOptionsDialogHook & {
  methods: PaymentMethod[]
} => {
  const options = usePaymentMethods(cartId)
  const result = useOptionsDialog({
    options: options.map((o) => ({
      id: o.id,
      label: o.name,
      button: true,
    })),
    ...other,
  })
  return { ...result, methods: options }
}

export type PaymentHookOptions<S extends string = string> = {
  paymentId?: string | null
  result?: PaymentResult<S> | null
  onClose?: () => void
  onError?: (error: unknown) => void
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
  onError,
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
  }, [paymentId, cancel.mutateAsync])

  useLayoutEffect(() => {
    if (result?.service && result.service != componentContainer.service) {
      getPaymentComponent(result.service).then((r) => {
        setComponentContainer(r)
      })
    }
  }, [result?.service, componentContainer.service])

  // reset error
  useLayoutEffect(() => {
    if (paymentId) {
      return () => setError(null)
    }
  }, [paymentId])

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
            if (e.json?.message) {
              setError(e.json.message)
            } else {
              setError(e.name)
            }
          } else {
            setError(String(e))
          }
          onError && onError(e)
          throw e
        }
      },
      [paymentId, update.mutateAsync],
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

export const PaymentContext = createOptionalContext<PaymentHook | null>(null)

export const usePaymentContext = <
  S extends string = string,
>(): PaymentHook<S> => {
  const ctx = useRequiredContext(PaymentContext)
  return ctx as unknown as PaymentHook<S>
}

const placeholder = { service: "", Component: PaymentPlaceholder } as const
