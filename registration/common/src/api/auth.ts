import { action, makeAutoObservable, when } from "mobx"
import { AuthAPI } from "./types.js"
import { FetchLike, WretchResponse } from "wretch"
import {
  Token,
  getTokenResponseInfo,
  listenTokenUpdate,
  loadToken,
  saveToken,
} from "./token.js"

export class AuthStore {
  private currentToken: Token | null = null
  private currentRefreshOperation: Promise<Token | null> | null = null

  readonly ready: Promise<void>
  private isReady = false

  constructor(
    private api: AuthAPI,
    private origin: string,
  ) {
    makeAutoObservable(this)
    this.ready = when(() => this.isReady)
    listenTokenUpdate((token) => this.setToken(token))
  }

  load() {
    const loaded = loadToken()
    if (loaded) {
      this.setToken(loaded)
    }
  }

  setToken(token: Token | null) {
    this.currentToken = token
    if (token) {
      this.isReady = true
    }
  }

  /**
   * Get auth middleware.
   */
  authMiddleware = (next: FetchLike): FetchLike => {
    const wrapped = (
      url: string,
      opts: RequestInit,
    ): Promise<WretchResponse> => {
      const urlObj = new URL(url, window.location.href)
      if (urlObj.origin == this.origin) {
        return withWaitReady(this.withRefresh(next), this.ready)(url, opts)
      } else {
        return next(url, opts)
      }
    }
    return wrapped
  }

  /**
   * Decorate a fetch function to attempt refreshing the access token.
   */
  withRefresh = (next: FetchLike): FetchLike => {
    const wrapper = async (
      url: string,
      opts: RequestInit,
    ): Promise<WretchResponse> => {
      await this.currentRefreshOperation

      let retryCount = 0
      for (;;) {
        const usedToken = this.currentToken
        const res = await withAuthHeader(next, usedToken)(url, opts)
        const curToken = this.currentToken
        if (
          res.status != 401 ||
          (!curToken?.refreshToken &&
            curToken?.accessToken == usedToken?.refreshToken)
        ) {
          // return if successful, or if refresh is not possible
          return res
        } else {
          if (
            !this.currentRefreshOperation &&
            curToken?.refreshToken &&
            curToken.accessToken == usedToken?.accessToken
          ) {
            // only attempt refresh if there isn't currently one in progress,
            // and the token hasn't been updated
            this.tryRefresh(curToken)
          }

          await this.currentRefreshOperation

          if (!this.currentToken?.accessToken) {
            // return if refresh was unsuccessful
            return res
          }

          // otherwise, retry
          if (retryCount < 3) {
            retryCount += 1
            continue
          } else {
            return res
          }
        }
      }
    }
    return wrapper
  }

  private tryRefresh(curToken: Token): Promise<Token | null> {
    this.currentRefreshOperation = refresh(this.api, curToken)
      .then(
        action((newToken) => {
          this.currentRefreshOperation = null
          const replaced = this.replaceToken(curToken, newToken)
          if (replaced?.accessToken == newToken?.accessToken) {
            saveToken(replaced)
          }
          return replaced
        }),
      )
      .catch(
        action((e) => {
          this.currentRefreshOperation = null
          throw e
        }),
      )
    return this.currentRefreshOperation
  }

  /**
   * Sets the current token without overwriting other updates.
   */
  private replaceToken(
    oldToken: Token | null,
    newToken: Token | null,
  ): Token | null {
    if (!newToken) {
      // clear the token without checking
      this.currentToken = null
      return null
    } else if (
      !this.currentToken ||
      this.currentToken.accessToken == oldToken?.accessToken
    ) {
      // only set the token if it is still the same as the old one
      this.currentToken = newToken
      return newToken
    } else {
      return this.currentToken
    }
  }
}

const refresh = async (
  api: AuthAPI,
  curToken: Token | null,
): Promise<Token | null> => {
  if (!curToken?.refreshToken) {
    return null
  }

  const res = await api.refreshToken(curToken.refreshToken)
  if (!res) {
    return null
  }
  const newToken = await getTokenResponseInfo(api, res)
  return newToken
}

/**
 * Decorate a fetch function to wait for the auth store to be ready.
 */
const withWaitReady = (
  next: FetchLike,
  readyPromise: Promise<void>,
): FetchLike => {
  const wrapped = async (
    url: string,
    opts: RequestInit,
  ): Promise<WretchResponse> => {
    await readyPromise
    return await next(url, opts)
  }
  return wrapped
}

/**
 * Decorate a fetch function to set the auth header.
 */
const withAuthHeader = (next: FetchLike, token: Token | null): FetchLike => {
  const wrapped = async (
    url: string,
    opts: RequestInit,
  ): Promise<WretchResponse> => {
    const newOpts = {
      ...opts,
      headers: new Headers(opts.headers),
    }

    if (token?.accessToken) {
      newOpts.headers.set("Authorization", `Bearer ${token.accessToken}`)
    }

    return await next(url, newOpts)
  }
  return wrapped
}
