import { makeAutoObservable, runInAction } from "mobx"
import { AuthAPI, Token } from "./types.js"
import { makeTokenFromResponse } from "./token.js"
import { isResponseError } from "../utils.js"
import { Wretch } from "wretch"
import { createAuthAPI } from "./authApi.js"
import { makeAuthMiddleware, makeRefreshMiddleware } from "./middleware.js"

export const createAuth = (
  origin: string,
  baseWretch: Wretch,
): [Wretch, AuthStore] => {
  const authAPI = createAuthAPI(baseWretch)

  const [authMiddleware, getAccessToken, setAccessToken] =
    makeAuthMiddleware(origin)

  const authStore = new AuthStore(authAPI, setAccessToken)

  const refreshMiddleware = makeRefreshMiddleware(
    getAccessToken,
    setAccessToken,
    (curToken) => authStore.refresh(curToken),
  )

  const authWretch = baseWretch.middlewares([refreshMiddleware, authMiddleware])
  return [authWretch, authStore]
}

/**
 * Stores auth tokens.
 */
export class AuthStore {
  private token: Token | null = null
  private curRefresh: Promise<string | null> = Promise.resolve(null)

  constructor(
    private api: AuthAPI,
    private setAuthToken: (token: string | null) => void,
  ) {
    makeAutoObservable(this)
  }

  get accessToken(): string | null {
    return this.token?.accessToken || null
  }

  async load() {
    const resp = await this.api.createNewToken()
    runInAction(() => {
      this.token = makeTokenFromResponse(resp)
      this.setAuthToken(this.token.accessToken)
    })
  }

  async refresh(curToken: string | null): Promise<string | null> {
    this.curRefresh = this.curRefresh
      .catch(() => void 0)
      .then(() => {
        return this._refresh(curToken)
      })
    return this.curRefresh
  }

  private async _refresh(curToken: string | null) {
    if (curToken != this.token?.accessToken) {
      return this.token && !this.token.getIsExpired()
        ? this.token.accessToken
        : null
    }

    if (!this.token?.refreshToken) {
      return null
    }

    try {
      const res = await this.api.refreshToken(this.token.refreshToken)
      runInAction(() => {
        this.token = makeTokenFromResponse(res)
      })
      return res.access_token
    } catch (e) {
      if (isResponseError(e) && e.status == 401) {
        runInAction(() => {
          this.token = null
        })
        return null
      } else {
        throw e
      }
    }
  }
}
