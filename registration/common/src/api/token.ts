import { Token, TokenResponse } from "./types.js"

/**
 * Create a {@link Token} from a token endpoint response.
 */
export const makeTokenFromResponse = (response: TokenResponse): Token => {
  let expiresAt = null
  if (response.expires_in != null) {
    const now = Math.floor(new Date().getTime() / 1000)
    expiresAt = now + response.expires_in
  }

  return new TokenImpl(
    response.access_token,
    response.refresh_token ?? null,
    expiresAt,
  )
}

/**
 * Parse a {@link Token} from an object.
 *
 * @returns A {@link Token} object, or null if it could not be parsed.
 */
export const makeTokenFromObject = (obj: object): Token | null => {
  try {
    const parsed = obj as {
      accessToken: string
      refreshToken?: string
      expiresAt?: number
    }

    return new TokenImpl(
      parsed.accessToken,
      parsed.refreshToken,
      parsed.expiresAt,
    )
  } catch (_) {
    return null
  }
}

class TokenImpl implements Token {
  expiresAt: Date | null
  constructor(
    public accessToken: string,
    public refreshToken: string | null = null,
    expiresAt: Date | number | null = null,
  ) {
    if (typeof expiresAt == "number") {
      this.expiresAt = new Date(expiresAt * 1000)
    } else {
      this.expiresAt = expiresAt
    }
  }

  getIsExpired(): boolean {
    const now = new Date().getTime()
    return this.expiresAt != null && now >= this.expiresAt.getTime()
  }

  toJSON() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresAt:
        this.expiresAt != null
          ? Math.floor(this.expiresAt.getTime() / 1000)
          : null,
    }
  }
}
