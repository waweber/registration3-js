import { ComponentType, ReactNode } from "react"

export type PaymentServiceRenderProps = {
  content?: ReactNode
  controls?: ReactNode
}

export type PaymentServiceComponentProps = {
  children: (renderProps: PaymentServiceRenderProps) => ReactNode
}

export type PaymentServiceComponent =
  ComponentType<PaymentServiceComponentProps>
