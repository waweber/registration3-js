import { SquareCardPaymentComponent } from "#src/features/payment/services/square/Card.js"
import { SquareCashPaymentComponent } from "#src/features/payment/services/square/Cash.js"
import { PaymentServiceComponentProps } from "#src/features/payment/types.js"
import { usePaymentManagerContext } from "@open-event-systems/registration-lib/payment"

export type SquarePaymentRequestBody = {
  source_id: string
  cash_amount?: number | null
  verification_token?: string | null
}

export type SquarePaymentResultBody = {
  method: "web" | "cash"
  environment: "production" | "sandbox"
  application_id: string
  location_id: string
  total_price: number
  total_price_str: string
  currency: string
  change?: number | null
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

export const SquarePaymentComponent = (props: PaymentServiceComponentProps) => {
  const ctx = usePaymentManagerContext<"square">()
  if (ctx.payment?.body.method == "cash") {
    return <SquareCashPaymentComponent {...props} />
  } else if (ctx.payment) {
    return <SquareCardPaymentComponent {...props} />
  }
}
