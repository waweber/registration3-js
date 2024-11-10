import {
  PaymentCloseButton,
  PaymentComplete,
} from "#src/features/payment/components/index.js"
import { SquareCardComponent } from "#src/features/payment/services/square/Card.js"
import { PaymentServiceComponentProps } from "#src/features/payment/types.js"
import { getErrorMessage } from "#src/utils.js"
import { usePaymentManagerContext } from "@open-event-systems/registration-lib/payment"
import { Card, Payments } from "@square/web-payments-sdk-types"
import { Suspense, useCallback } from "react"

export type SquarePaymentRequestBody = {
  source_id: string
  verification_token?: string | null
}

export type SquarePaymentResultBody = {
  environment: "production" | "sandbox"
  application_id: string
  location_id: string
  total_price: number
  total_price_str: string
  currency: string
}

declare module "@open-event-systems/registration-lib/payment" {
  export interface PaymentServiceMap {
    square: "square"
  }

  interface PaymentRequestBodyMap {
    square: SquarePaymentRequestBody
  }

  interface PaymentResultBodyMap {
    square: SquarePaymentResultBody
  }
}

export const SquarePaymentComponent = ({
  children,
}: PaymentServiceComponentProps) => {
  const ctx = usePaymentManagerContext<"square">()
  const { payment, submitting, setSubmitting, update, setError } = ctx

  const onSubmit = useCallback(
    async (card: Card, payments: Payments) => {
      if (!payment || submitting) {
        return
      }

      setError(null)
      setSubmitting(true)
      try {
        const tokenRes = await card.tokenize()
        const token = tokenRes.token
        if (tokenRes.errors && tokenRes.errors.length > 0) {
          setError(tokenRes.errors[0].message)
          setSubmitting(false)
          return
        } else if (!token) {
          setError("Payment failed")
          setSubmitting(false)
          return
        }

        const verifyRes = await payments.verifyBuyer(token, {
          amount: payment.body.total_price_str,
          billingContact: {},
          currencyCode: payment.body.currency,
          intent: "CHARGE",
        })

        await update({
          source_id: token,
          verification_token: verifyRes?.token,
        })

        setSubmitting(false)
      } catch (e) {
        setError(getErrorMessage(e))
        setSubmitting(false)
      }
    },
    [payment, submitting],
  )

  if (!payment) {
    return (
      <SquareCardComponent.Placeholder>
        {children}
      </SquareCardComponent.Placeholder>
    )
  } else if (payment.status == "completed") {
    return children({
      content: <PaymentComplete />,
      controls: <PaymentCloseButton />,
    })
  } else {
    return (
      <Suspense
        fallback={
          <SquareCardComponent.Placeholder>
            {children}
          </SquareCardComponent.Placeholder>
        }
      >
        <SquareCardComponent body={payment.body} onSubmit={onSubmit}>
          {children}
        </SquareCardComponent>
      </Suspense>
    )
  }
}
