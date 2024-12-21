import { Button, Skeleton, TextInput } from "@mantine/core"
import { useCallback, useState } from "react"
import { PaymentServiceComponentProps } from "#src/features/payment/index.js"
import { Currency } from "#src/components/index.js"
import {
  PaymentCloseButton,
  PaymentComplete,
} from "#src/features/payment/components/index.js"
import { usePaymentManagerContext } from "@open-event-systems/registration-lib/payment"

export type MockPaymentRequestBody = {
  card_number: string
}

export type MockPaymentResultBody = {
  currency: string
  total_price: number
  total_price_string: string
}

declare module "#src/features/payment/types.js" {
  interface PaymentRequestBodyMap {
    mock: MockPaymentRequestBody
  }

  interface PaymentResultBodyMap {
    mock: MockPaymentResultBody
  }
}

export const MockPaymentComponent = ({
  children,
}: PaymentServiceComponentProps) => {
  const [cardNo, setCardNo] = useState(() => "")
  const ctx = usePaymentManagerContext<"mock">()
  const { payment, submitting, setSubmitting, update } = ctx

  const doUpdate = useCallback(() => {
    if (submitting || !cardNo) {
      return
    }

    setSubmitting(true)
    update({ card_number: cardNo })
      .then(() => {
        setSubmitting(false)
      })
      .catch(() => setSubmitting(false))
  }, [submitting, cardNo])

  let content
  let controls

  if (!payment) {
    content = <Skeleton h={36} />
  } else if (payment.status == "completed") {
    content = <PaymentComplete />
    controls = <PaymentCloseButton />
  } else {
    content = (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          doUpdate()
        }}
      >
        <TextInput
          inputMode="numeric"
          placeholder="Card #"
          title="Card Number"
          value={cardNo}
          onChange={(e) => setCardNo(e.target.value)}
        />
      </form>
    )
    controls = (
      <Button
        onClick={() => {
          doUpdate()
        }}
        fullWidth
      >
        Pay{" "}
        <Currency
          code={payment.body.currency}
          amount={payment.body.total_price}
        />
      </Button>
    )
  }

  return children({
    content,
    controls,
  })
}
