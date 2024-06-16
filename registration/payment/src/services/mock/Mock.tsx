import { Button, Skeleton, TextInput } from "@mantine/core"
import { useCallback, useState } from "react"
import { Currency } from "@open-event-systems/registration-common/components"
import { PaymentServiceComponentProps } from "../../types.js"
import { usePaymentContext } from "../../hooks/payment.js"
import { PaymentCloseButton, PaymentComplete } from "../../components/index.js"

export type MockPaymentRequestBody = {
  card_number: string
}

export type MockPaymentResultBody = {
  currency: string
  total_price: number
  total_price_string: string
}

declare module "@open-event-systems/registration-payment" {
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
  const ctx = usePaymentContext<"mock">()
  const { result, submitting, setSubmitting, update } = ctx

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

  if (!result) {
    content = <Skeleton h={36} />
  } else if (result.status == "completed") {
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
          code={result.body.currency}
          amount={result.body.total_price}
        />
      </Button>
    )
  }

  return children({
    content,
    controls,
  })
}