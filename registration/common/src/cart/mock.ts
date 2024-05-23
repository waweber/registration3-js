import { NotFoundError } from "../utils.js"
import { CartAPI } from "./api.js"
import { CartPricingResult } from "./types.js"

const delay = (n: number) => new Promise((r) => window.setTimeout(r, n))

export const makeMockCartAPI = (): CartAPI => {
  let counter = 10
  const carts: Record<string, CartPricingResult> = {
    empty: {
      currency: "USD",
      registrations: [],
      total_price: 0,
    },
    "1": {
      currency: "USD",
      registrations: [
        {
          id: "1",
          name: "Registration 1",
          line_items: [
            {
              name: "Attendee Registration",
              description: "Standard attendee registration.",
              price: 5500,
              modifiers: [{ name: "Early Bird Discount", amount: -500 }],
              total_price: 5000,
            },
          ],
          total_price: 5000,
        },
      ],
      total_price: 5000,
    },
  }

  return {
    async readEmptyCart() {
      await delay(100)
      return {
        id: "empty",
      }
    },
    async readCart(cartId) {
      await delay(100)
      if (!(cartId in carts)) {
        throw new NotFoundError()
      }
      return { id: cartId }
    },
    async readCartPricingResult(cartId) {
      await delay(300)
      if (!(cartId in carts)) {
        throw new NotFoundError()
      }
      return carts[cartId]
    },
    async removeRegistrationFromCart(cartId, registrationId) {
      await delay(300)
      if (!(cartId in carts)) {
        throw new NotFoundError()
      }
      const cart = carts[cartId]
      const newCart = {
        ...cart,
        registrations: cart.registrations.filter((r) => r.id != registrationId),
      }
      const newId = `${counter++}`
      carts[newId] = newCart
      return { id: newId }
    },
  }
}
