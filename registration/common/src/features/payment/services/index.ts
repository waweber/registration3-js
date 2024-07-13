import { PaymentServiceComponentProps } from "#src/features/payment/index.js"
import { ComponentType } from "react"

const paymentComponents: Record<
  string,
  | (() => Promise<
      Readonly<{ Component: ComponentType<PaymentServiceComponentProps> }>
    >)
  | undefined
> = {
  async system() {
    const system = await import("./system/System.js")
    return { Component: system.SystemPaymentComponent }
  },
  async mock() {
    const mock = await import("./mock/Mock.js")
    return { Component: mock.MockPaymentComponent }
  },
  async square() {
    const square = await import("./square/Square.js")
    return { Component: square.SquarePaymentComponent }
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
