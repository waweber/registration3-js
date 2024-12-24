import { currencyDecimals } from "#src/components/currency/currency-info.js"
import { Currency } from "#src/components/index.js"
import { PaymentCloseButton } from "#src/features/payment/components/index.js"
import { PaymentServiceComponentProps } from "#src/features/payment/types.js"
import { getErrorMessage } from "#src/utils.js"
import { Button, NumberInput, Stack, Text } from "@mantine/core"
import { usePaymentManagerContext } from "@open-event-systems/registration-lib/payment"
import { ReactNode, useState } from "react"

export const SquareCashPaymentComponent = ({
  children,
}: PaymentServiceComponentProps) => {
  const ctx = usePaymentManagerContext<"square">()
  const { payment, submitting, setSubmitting, update, setError } = ctx
  const [cashValue, setCashValue] = useState<string | number>(0)

  if (!payment) {
    return
  }

  let content: ReactNode
  let controls: ReactNode

  if (payment.status == "pending") {
    content = (
      <>
        <Text>
          Cash due:{" "}
          <strong>
            <Currency
              amount={payment.body.total_price}
              code={payment.body.currency}
            />
          </strong>
        </Text>
        <NumberInput
          label="Cash Received"
          min={0}
          value={cashValue}
          onChange={(v) => setCashValue(v)}
        />
      </>
    )
    controls = (
      <Button
        onClick={() => {
          if (submitting || typeof cashValue != "number") {
            return
          }

          setSubmitting(true)
          setError(null)

          const decimals = currencyDecimals[payment.body.currency] ?? 2
          const cashAmount = Math.floor(Math.pow(10, decimals) * cashValue)

          update({
            source_id: "CASH",
            cash_amount: cashAmount,
          })
            .then(() => {
              setSubmitting(false)
            })
            .catch((e) => {
              setError(getErrorMessage(e))
              setSubmitting(false)
            })
        }}
      >
        Accept
      </Button>
    )
  } else if (payment.status == "completed") {
    content = (
      <>
        <Text>
          Change due:{" "}
          <strong>
            <Currency
              amount={payment.body.change ?? 0}
              code={payment.body.currency}
            />
          </strong>
        </Text>
      </>
    )
    controls = <PaymentCloseButton />
  }

  return children({ content, controls })
}
