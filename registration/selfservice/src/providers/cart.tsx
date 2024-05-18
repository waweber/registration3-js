import { CartAPI } from "@open-event-systems/registration-common"
import { createContext } from "react"
import { ReactNode } from "@tanstack/react-router"

export const CartAPIContext = createContext<CartAPI | null>(null)

export const CartAPIProvider = ({
  cartAPI,
  children,
}: {
  cartAPI: CartAPI
  children?: ReactNode
}) => {
  return (
    <CartAPIContext.Provider value={cartAPI}>
      {children}
    </CartAPIContext.Provider>
  )
}
