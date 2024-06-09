import { createContext, useContext } from "react"
import { AuthStore } from "../api/auth.js"

export const AuthContext = createContext<AuthStore | null>(null)

export const useAuth = (): AuthStore => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("Auth context not provided")
  }
  return ctx
}
