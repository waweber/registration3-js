import { Registration } from "#src/registration/types.js"

export type Cart = {
  id: string
}

export type CartData = {
  event_id: string
  registrations: CartRegistration[]
}

export type CartRegistration = {
  id: string
  old: Partial<Registration>
  new: Partial<Registration>
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
} as const

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

export type MockCartAPI = CartAPI & {
  get carts(): Map<string, CartPricingResult>
}

export type CurrentCartStore = {
  set(eventId: string, cartId: string | null): void
  get(eventId: string): string | null
}
