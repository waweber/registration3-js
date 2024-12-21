import {
  CartPricingResult,
  MockCartAPI,
  PricingResultRegistration,
} from "#src/cart/types.js"
import { NotFoundError } from "#src/utils.js"

export const MOCK_EMPTY_CART_ID = "empty"

export const makeMockCartAPI = (
  initialData?: Map<string, CartPricingResult>,
): MockCartAPI => {
  const carts = new Map<string, CartPricingResult>()

  carts.set(MOCK_EMPTY_CART_ID, {
    currency: "USD",
    registrations: [],
    total_price: 0,
  })

  initialData?.forEach((v, k) => carts.set(k, v))

  let counter = 10

  return {
    carts,
    async readEmptyCart() {
      return {
        id: MOCK_EMPTY_CART_ID,
      }
    },
    async readCart(cartId) {
      if (!carts.has(cartId)) {
        throw new NotFoundError()
      }
      return { id: cartId }
    },
    async readCartPricingResult(cartId) {
      const cart = carts.get(cartId)
      if (!cart) {
        throw new NotFoundError()
      }
      return cart
    },
    async removeRegistrationFromCart(cartId, registrationId) {
      const cart = carts.get(cartId)
      if (!cart) {
        throw new NotFoundError()
      }
      const newCart = {
        ...cart,
        registrations: cart.registrations.filter((r) => r.id != registrationId),
      }
      newCart.total_price = computePrice(newCart.registrations)

      const newId = `${counter++}`
      carts.set(newId, newCart)
      return { id: newId }
    },
  }
}

const computePrice = (registrations: PricingResultRegistration[]): number => {
  let total = 0
  registrations.forEach((r) => {
    total += r.total_price
  })

  return total
}
