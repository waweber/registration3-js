import { ConfiguredMiddleware, FetchLike, WretchResponse } from "wretch"

/**
 * Get a wretch middleware to set the auth header.
 * @param origin - the expected origin
 * @returns the middleware, a function to get the auth token, and a function to
 *   set the auth token
 */
export const makeAuthMiddleware = (
  origin: string,
): [
  ConfiguredMiddleware,
  () => string | null,
  (token: string | null) => void,
] => {
  let authToken: string | null = null
  let ready: () => void = () => void 0
  const readyPromise = new Promise<void>((r) => {
    ready = r
  })

  const middleware = (next: FetchLike): FetchLike => {
    const wrapped = async (
      url: string,
      options: RequestInit,
    ): Promise<WretchResponse> => {
      let fullOptions = options
      const urlObj = new URL(url, window.location.href)

      await readyPromise

      if (authToken && urlObj.origin == origin) {
        fullOptions.headers = {
          ...fullOptions.headers,
          Authorization: `Bearer ${authToken}`,
        }
      }

      return await next(url, fullOptions)
    }
    return wrapped
  }

  const getAuthToken = (): string | null => {
    return authToken
  }

  const setAuthToken = (token: string | null) => {
    authToken = token
    ready()
  }

  return [middleware, getAuthToken, setAuthToken]
}

/**
 * Get a wretch middleware that attempts to use a refresh token on a 401.
 * @param getAccessToken - a function to get the current access token
 * @param refreshFunc - a function to use a refresh token
 * @returns
 */
export const makeRefreshMiddleware = (
  getAccessToken: () => string | null,
  setAccessToken: (token: string | null) => void,
  refreshFunc: (curToken: string | null) => Promise<string | null>,
) => {
  const middleware = (next: FetchLike): FetchLike => {
    const wrapper = async (
      url: string,
      options: RequestInit,
    ): Promise<WretchResponse> => {
      while (true) {
        const usedAccessToken = getAccessToken()
        const resp = await next(url, options)
        if (resp.status == 401) {
          const newToken = await refreshFunc(usedAccessToken)
          if (newToken) {
            setAccessToken(newToken)
            continue
          } else {
            return resp
          }
        } else {
          return resp
        }
      }
    }
    return wrapper
  }
  return middleware
}
