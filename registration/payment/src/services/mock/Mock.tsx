import { Button, Stack, Text, TextInput } from "@mantine/core"
import { useState } from "react"
import { usePaymentContext } from "../../context.js"
import { Currency } from "@open-event-systems/registration-common/components"
import { Payment } from "../../components/payment/Payment.js"

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

export const MockPaymentComponent = () => {
  const [cardNo, setCardNo] = useState(() => "")
  const ctx = usePaymentContext<"mock">()
  const { result, submitting, setSubmitting, update, error } = ctx

  if (!result) {
    return <Payment.Placeholder />
  }

  if (result.status == "completed") {
    return <Payment.Complete />
  }
  if (result.status == "canceled") {
    return <Payment.Canceled />
  }

  return (
    <Stack
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        if (submitting || !cardNo) {
          return
        }

        setSubmitting(true)
        update({ card_number: cardNo })
          .then(() => {
            setSubmitting(false)
          })
          .catch(() => setSubmitting(false))
      }}
    >
      <TextInput
        inputMode="numeric"
        placeholder="Card #"
        title="Card Number"
        value={cardNo}
        onChange={(e) => setCardNo(e.target.value)}
      />
      <Button type="submit">
        Pay{" "}
        <Currency
          amount={ctx.result?.body.total_price}
          code={ctx.result?.body.currency}
        />
      </Button>
      {error && <Text c="red">{error}</Text>}
    </Stack>
  )
}
