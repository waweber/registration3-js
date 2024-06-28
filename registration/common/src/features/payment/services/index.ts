import { PaymentServiceComponentProps } from "#src/features/payment/index.js"
import { ComponentType } from "react"

const paymentComponents: Record<
  string,
  | (() => Promise<
      Readonly<{ Component: ComponentType<PaymentServiceComponentProps> }>
    >)
  | undefined
> = {
  async mock() {
    const mock = await import("./mock/Mock.js")
    return { Component: mock.MockPaymentComponent }
  },
}

/**
 * Get the component for a payment service.
 */
export const getPaymentComponent = async <S extends string = string>(
  service: S,
): Promise<
  Readonly<{
    service: S
    Component: ComponentType<PaymentServiceComponentProps>
  }>
> => {
  const loader = paymentComponents[service]
  if (!loader) {
    throw new Error(`Unsupported payment service: ${service}`)
  }
  const container = await loader()
  return { service, Component: container.Component }
}
