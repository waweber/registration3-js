import { useCallback, useState } from "react"
import { AuthStore } from "../api/auth.js"
import { AuthAPI } from "../api/types.js"
import { AuthAPIContext, AuthContext } from "../api/AuthProvider.js"
import { createAuthAPI } from "../api/authApi.js"
import wretch from "wretch"
import { Token } from "../api/token.js"
import { useRequiredContext } from "../utils.js"

export const useCreateAuth = (baseURL: string): [AuthStore, AuthAPI] => {
  const urlObj = new URL(baseURL, window.location.href)
  const [api] = useState(() => createAuthAPI(wretch(baseURL)))
  const [authStore] = useState(() => new AuthStore(api, urlObj.origin))

  return [authStore, api]
}

export const useSetupAuth = (
  store: AuthStore,
  api: AuthAPI,
): (() => Promise<void>) => {
  return useCallback(async () => {
    await [store.loadToken, store.createToken].reduce(
      (p, c) => p.then((res) => (res ? res : c.bind(store)())),
      Promise.resolve<Token | null>(null),
    )
  }, [store, api])
}

export const useAuth = (): AuthStore => useRequiredContext(AuthContext)
export const useAuthAPI = (): AuthAPI => useRequiredContext(AuthAPIContext)
