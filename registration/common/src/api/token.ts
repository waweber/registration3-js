import { TokenResponse } from "./types.js"

export type Token = Readonly<{
  accessToken: string
  refreshToken: string | null
  expiresAt: Date
  accountId: string | null
  email: string | null
  scope: string
  getIsExpired(now?: Date): boolean
}>

const LOCAL_STORAGE_KEY = "oes-auth-v1"

/**
 * Save a token to local storage.
 */
export const saveToken = (token: Token | null) => {
  if (token) {
    const jsonStr = JSON.stringify(token)
    window.localStorage.setItem(LOCAL_STORAGE_KEY, jsonStr)
  } else {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
}

/**
 * Listen for token updates from other tabs.
 */
export const listenTokenUpdate = (
  setToken: (token: Token | null) => void,
): (() => void) => {
  const handler = (e: StorageEvent) => {
    if (e.key == LOCAL_STORAGE_KEY && e.newValue) {
      const obj = JSON.parse(e.newValue)
      const token = makeTokenFromObject(obj)
      if (token) {
        setToken(token)
      } else {
        setToken(null)
      }
    }
  }

  window.addEventListener("storage", handler)

  return () => {
    window.removeEventListener("storage", handler)
  }
}

/**
 * Load a token from local storage.
 */
export const loadToken = (): Token | null => {
  try {
    const jsonStr = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!jsonStr) {
      return null
    }

    const obj = JSON.parse(jsonStr)
    return makeTokenFromObject(obj)
  } catch (_) {
    return null
  }
}

/**
 * Create a {@link Token} from a token endpoint and info endpoint response.
 */
export const makeTokenFromResponse = (tokenResponse: TokenResponse): Token => {
  let expiresAt = new Date()
  if (tokenResponse.expires_in != null) {
    const now = Math.floor(new Date().getTime() / 1000)
    expiresAt = new Date((now + tokenResponse.expires_in) * 1000)
  }

  return makeToken({
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token ?? null,
    expiresAt,
    accountId: tokenResponse.account_id || null,
    email: tokenResponse.email || null,
    scope: tokenResponse.scope || "",
  })
}

/**
 * Parse a {@link Token} from an object.
 *
 * @returns A {@link Token} object, or null if it could not be parsed.
 */
export const makeTokenFromObject = (
  obj: Record<string, unknown>,
): Token | null => {
  try {
    const accessToken =
      typeof obj.accessToken == "string" && obj.accessToken
        ? obj.accessToken
        : null
    const refreshToken =
      (typeof obj.refreshToken == "string" ? obj.refreshToken : "") || null
    const expiresAt =
      typeof obj.expiresAt == "number" &&
      !isNaN(new Date(obj.expiresAt * 1000).getTime())
        ? new Date(obj.expiresAt * 1000)
        : null
    const accountId =
      (typeof obj.accountId == "string" ? obj.accountId : "") || null
    const email = (typeof obj.email == "string" ? obj.email : "") || null
    const scope = typeof obj.scope == "string" ? obj.scope : ""

    if (!accessToken || !refreshToken || !expiresAt) {
      return null
    }

    return makeToken({
      accessToken,
      refreshToken,
      accountId,
      expiresAt,
      email,
      scope,
    })
  } catch (_) {
    return null
  }
}

const makeToken = (
  tokenProps: Omit<Token, "getIsExpired">,
): Token & { toJSON(): unknown } => {
  return {
    ...tokenProps,
    getIsExpired(now) {
      const nowT = now ? now.getTime() : new Date().getTime()
      return nowT >= this.expiresAt?.getTime()
    },
    toJSON() {
      return {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresAt: Math.floor(this.expiresAt.getTime() / 1000),
        accountId: this.accountId,
        email: this.email,
        scope: this.scope,
      }
    },
  }
}
