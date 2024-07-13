import { Currency } from "#src/components/index.js"
import { SquarePaymentResultBody } from "#src/features/payment/services/square/Square.js"
import {
  useCard,
  useSquare,
} from "#src/features/payment/services/square/square.js"
import { PaymentServiceComponentProps } from "#src/features/payment/types.js"
import { Box, Button, Skeleton } from "@mantine/core"
import { Card, Payments } from "@square/web-payments-sdk-types"
import { useCallback, useLayoutEffect } from "react"

export const SquareCardComponent = ({
  body,
  onSubmit,
  children,
}: {
  body: SquarePaymentResultBody
  onSubmit?: (card: Card, payments: Payments) => void
} & PaymentServiceComponentProps) => {
  const payments = useSquare(
    body.application_id,
    body.location_id,
    body.environment == "sandbox",
  )

  const handleSubmit = useCallback(
    (card: Card) => {
      return onSubmit && onSubmit(card, payments)
    },
    [payments, onSubmit],
  )

  const { ref, card } = useCard(payments, handleSubmit)

  const show = !!card

  useLayoutEffect(() => {
    card?.recalculateSize()
  }, [show, card])

  const controls = show ? (
    <Button
      fullWidth
      onClick={() => {
        onSubmit && onSubmit(card, payments)
      }}
    >
      Pay <Currency amount={body.total_price} code={body.currency} />
    </Button>
  ) : (
    <Skeleton h={36} />
  )

  const content = (
    <>
      {!show && <Skeleton h={99} mb={41} />}
      <Box
        ref={ref}
        style={{
          display: show ? undefined : "none",
        }}
      ></Box>
    </>
  )

  return children({ content, controls })
}

const SquareCardComponentPlaceholder = ({
  children,
}: PaymentServiceComponentProps) =>
  children({
    content: <Skeleton h={99} mb={41} />,
    controls: <Skeleton h={36} />,
  })

SquareCardComponent.Placeholder = SquareCardComponentPlaceholder
