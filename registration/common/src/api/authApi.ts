import { Wretch, WretchResponse } from "wretch"
import { AuthAPI, TokenResponse } from "./types.js"
import { formUrlAddon } from "wretch/addons"

export const createAuthAPI = (wretch: Wretch): AuthAPI => {
  return {
    async createNewToken() {
      return await wretch.url("/auth/create").json({}).post().json()
    },
    async readInfo(accessToken) {
      return await wretch
        .url("/auth/info")
        .headers({
          Authorization: `Bearer ${accessToken}`,
        })
        .get()
        .json()
    },
    async sendEmail(accessToken, email) {
      const res = await wretch
        .url("/auth/email")
        .headers({
          Authorization: `Bearer ${accessToken}`,
        })
        .json({
          email: email,
        })
        .post()
        .unauthorized(() => false)
        .forbidden(() => false)
        .error(422, () => false)
        .res<WretchResponse | boolean>()
      return res !== false
    },
    async verifyEmail(accessToken, email, code) {
      return await wretch
        .url("/auth/email/verify")
        .headers({
          Authorization: `Bearer ${accessToken}`,
        })
        .json({
          email: email,
          code: code,
        })
        .post()
        .unauthorized(() => null)
        .forbidden(() => null)
        .error(422, () => null)
        .json<TokenResponse | null>()
    },
    async refreshToken(refreshToken) {
      return await wretch
        .url("/auth/token")
        .addon(formUrlAddon)
        .formUrl({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        })
        .post()
        .forbidden(() => null)
        .unauthorized(() => null)
        .json<TokenResponse | null>()
    },
  }
}
