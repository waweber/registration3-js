export type Cart = {
  id: string
}

export type CartPricingResult = {
  currency: string
  total_price: number
  registrations: PricingResultRegistration[]
}

export type PricingResultRegistration = {
  id: string
  total_price: number
  line_items: LineItem[]
  name?: string
}

export type LineItem = {
  price: number
  total_price: number
  modifiers: Modifier[]

  name?: string
  description?: string
}

export type Modifier = {
  amount: number
  name?: string
}

export const cartConflictErrorCode = {
  version: "version",
  status: "status",
  event: "event",
}

export type CartConflictErrorCode = keyof typeof cartConflictErrorCode

export type CartConflictResult = {
  change: { id: string }
  errors: CartConflictErrorCode[]
}

export type CartConflictError = {
  results: CartConflictResult[]
}

export type CartAPI = {
  readEmptyCart: (eventId: string) => Promise<Cart>
  readCart: (cartId: string) => Promise<Cart>
  readCartPricingResult: (cartId: string) => Promise<CartPricingResult>
  removeRegistrationFromCart: (
    cartId: string,
    registrationId: string,
  ) => Promise<Cart>
}
