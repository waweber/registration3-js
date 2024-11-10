import { getPaymentComponent } from "#src/features/payment/services/index.js"
import {
  useOptionsDialog,
  UseOptionsDialogHook,
  UseOptionsDialogOptions,
} from "#src/hooks/options.js"
import {
  PaymentMethod,
  usePaymentMethods,
} from "@open-event-systems/registration-lib/payment"
import {
  PaymentResult,
  PaymentServiceID,
} from "@open-event-systems/registration-lib/payment"
import { useSuspenseQuery } from "@tanstack/react-query"

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

export const usePaymentComponent = <
  S extends PaymentServiceID = PaymentServiceID,
>(
  payment: PaymentResult<S> | null | undefined,
) => {
  const query = useSuspenseQuery({
    queryKey: ["payment", payment?.id, "component"],
    async queryFn() {
      if (payment?.service) {
        return await getPaymentComponent(payment.service)
      }
    },
    staleTime: Infinity,
  })
  return query.data
}
