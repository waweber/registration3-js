import { Button, Skeleton, Text } from "@mantine/core"
import { useCallback } from "react"
import { PaymentServiceComponentProps } from "#src/features/payment/index.js"
import {
  PaymentCloseButton,
  PaymentComplete,
} from "#src/features/payment/components/index.js"
import { usePaymentManagerContext } from "@open-event-systems/registration-lib/payment"

export type SystemPaymentRequestBody = Record<string, never>
export type SystemPaymentResultBody = Record<string, never>

declare module "@open-event-systems/registration-lib/payment" {
  export interface PaymentServiceMap {
    system: "system"
  }

  export interface PaymentRequestBodyMap {
    system: SystemPaymentRequestBody
  }

  export interface PaymentResultBodyMap {
    system: SystemPaymentResultBody
  }
}

export const SystemPaymentComponent = ({
  children,
}: PaymentServiceComponentProps) => {
  const ctx = usePaymentManagerContext<"system">()
  const { payment, submitting, setSubmitting, update } = ctx

  const doUpdate = useCallback(() => {
    if (submitting) {
      return
    }

    setSubmitting(true)
    update({})
      .then(() => {
        setSubmitting(false)
      })
      .catch(() => setSubmitting(false))
  }, [submitting])

  let content
  let controls

  if (!payment) {
    content = <Skeleton h={36} />
  } else if (payment.status == "completed") {
    content = <PaymentComplete />
    controls = <PaymentCloseButton />
  } else {
    content = (
      <Text component="p">
        No payment is due at this time, you&apos;re all set!
      </Text>
    )
    controls = (
      <Button
        onClick={() => {
          doUpdate()
        }}
        fullWidth
      >
        Complete
      </Button>
    )
  }

  return children({
    content,
    controls,
  })
}
