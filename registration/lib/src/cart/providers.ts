import { CookieCurrentCartStore } from "#src/cart/store.js"
import { CartAPI } from "#src/cart/types.js"
import { createOptionalContext } from "#src/utils.js"
import { createContext } from "react"

export const CartAPIContext = createOptionalContext<CartAPI>()
export const CurrentCartStoreContext = createContext(
  new CookieCurrentCartStore(),
)

export const CartAPIProvider = CartAPIContext.Provider
export const CurrentCartStoreProvider = CurrentCartStoreContext.Provider
