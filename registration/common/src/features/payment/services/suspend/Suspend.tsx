import { Text } from "@mantine/core"
import { PaymentServiceComponentProps } from "#src/features/payment/index.js"
import { PaymentCloseButton } from "#src/features/payment/components/index.js"
import { usePaymentManagerContext } from "@open-event-systems/registration-lib/payment"

export type SuspendPaymentResultBody = {
  message?: string | null
}

declare module "@open-event-systems/registration-lib/payment" {
  export interface PaymentServiceMap {
    suspend: "suspend"
  }

  interface PaymentResultBodyMap {
    suspend: SuspendPaymentResultBody
  }
}

export const SuspendPaymentComponent = ({
  children,
}: PaymentServiceComponentProps) => {
  const ctx = usePaymentManagerContext<"suspend">()
  const { payment } = ctx

  const message =
    payment?.body.message || "Visit registration to complete your payment."

  return children({
    content: <Text component="p">{message}</Text>,
    controls: <PaymentCloseButton />,
  })
}
