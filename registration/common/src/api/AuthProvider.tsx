import { ReactNode, createContext } from "react"
import { AuthStore } from "./auth.js"
import { AuthAPI } from "./types.js"

export const AuthContext = createContext<AuthStore | null>(null)
export const AuthAPIContext = createContext<AuthAPI | null>(null)

export const AuthProvider = ({
  store,
  api,
  children,
}: {
  store: AuthStore
  api: AuthAPI
  children?: ReactNode
}) => {
  return (
    <AuthAPIContext.Provider value={api}>
      <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
    </AuthAPIContext.Provider>
  )
}
