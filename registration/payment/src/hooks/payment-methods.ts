import { useSuspenseQuery } from "@tanstack/react-query"
import { usePaymentAPI } from "../api.js"
import { PaymentMethod } from "../types.js"
import {
  UseOptionsDialogHook,
  UseOptionsDialogOptions,
  useOptionsDialog,
} from "@open-event-systems/registration-common"

export const usePaymentMethods = (cartId: string): PaymentMethod[] => {
  const paymentAPI = usePaymentAPI()
  const methodsQuery = useSuspenseQuery({
    queryKey: ["carts", cartId, "payment-methods"],
    async queryFn() {
      return await paymentAPI.getPaymentMethods(cartId)
    },
  })
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
