import { Button, Skeleton, Text, TextInput } from "@mantine/core"
import { useCallback, useState } from "react"
import {
  PaymentServiceComponentProps,
  usePaymentContext,
} from "#src/features/payment/index.js"
import { Currency } from "#src/components/index.js"
import {
  PaymentCloseButton,
  PaymentComplete,
} from "#src/features/payment/components/index.js"

export type SystemPaymentRequestBody = Record<string, never>
export type SystemPaymentResultBody = Record<string, never>

declare module "#src/features/payment/types.js" {
  interface PaymentRequestBodyMap {
    system: SystemPaymentRequestBody
  }

  interface PaymentResultBodyMap {
    system: SystemPaymentResultBody
  }
}

export const SystemPaymentComponent = ({
  children,
}: PaymentServiceComponentProps) => {
  const ctx = usePaymentContext<"system">()
  const { result, submitting, setSubmitting, update } = ctx

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

  if (!result) {
    content = <Skeleton h={36} />
  } else if (result.status == "completed") {
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
