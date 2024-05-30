import { action, makeAutoObservable, runInAction } from "mobx"
import { AuthAPI, Token } from "./types.js"
import { makeTokenFromObject, makeTokenFromResponse } from "./token.js"
import { isResponseError } from "../utils.js"
import { Wretch } from "wretch"
import { createAuthAPI } from "./authApi.js"
import { makeAuthMiddleware, makeRefreshMiddleware } from "./middleware.js"

const LOCAL_STORAGE_KEY = "oes-auth-v1"

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
    listenTokenReplace(
      action((token) => {
        this.curRefresh = this.curRefresh
          .catch(() => null)
          .then(
            action(() => {
              this.token = token
              this.setAuthToken(token.accessToken)
              return token.accessToken
            }),
          )
      }),
    )
  }

  get accessToken(): string | null {
    return this.token?.accessToken || null
  }

  async load() {
    const loaded = getTokenFromStorage()
    if (loaded) {
      runInAction(() => {
        this.token = loaded
        this.setAuthToken(this.token.accessToken)
      })

      if (loaded.getIsExpired()) {
        await this.refresh(loaded.accessToken)
      }
    } else {
      const resp = await this.api.createNewToken()
      runInAction(() => {
        this.token = makeTokenFromResponse(resp)
        this.setAuthToken(this.token.accessToken)
        saveTokenToStorage(this.token)
      })
    }
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
        saveTokenToStorage(this.token)
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

const getTokenFromStorage = () => {
  const item = window.localStorage.getItem(LOCAL_STORAGE_KEY)
  if (item) {
    try {
      const obj = JSON.parse(item)
      return makeTokenFromObject(obj)
    } catch (_) {
      return null
    }
  }
  return null
}

const saveTokenToStorage = (token: Token | null) => {
  if (token) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(token))
  } else {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
}

const listenTokenReplace = (replaceFunc: (token: Token) => void) => {
  const listener = (e: StorageEvent) => {
    if (e.key == LOCAL_STORAGE_KEY && e.newValue && e.newValue != e.oldValue) {
      try {
        const obj = JSON.parse(e.newValue)
        replaceFunc(obj)
      } catch (_) {
        return
      }
    }
  }

  window.addEventListener("storage", listener)
}
