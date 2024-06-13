import { Wretch, WretchResponse } from "wretch"
import { AuthAPI, TokenResponse, WebAuthnChallenge } from "./types.js"
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
    async readWebAuthnRegistrationChallenge(accessToken) {
      return await wretch
        .url("/auth/webauthn/register")
        .headers({
          Authorization: `Bearer ${accessToken}`,
        })
        .get()
        .json()
    },
    async completeWebAuthnRegistration(accessToken, token, response) {
      return await wretch
        .url("/auth/webauthn/register")
        .json({
          token: token,
          response: response,
        })
        .headers({
          Authorization: `Bearer ${accessToken}`,
        })
        .post()
        .json()
    },
    async readWebAuthnAuthenticationChallenge(credentialId) {
      return await wretch
        .url("/auth/webauthn/start-authenticate")
        .json({ credential_id: credentialId })
        .post()
        .notFound(() => null)
        .forbidden(() => null)
        .json<WebAuthnChallenge | null>()
    },
    async completeWebAuthnAuthenticationChallenge(token, response) {
      return await wretch
        .url("/auth/webauthn/authenticate")
        .json({
          token: token,
          response: response,
        })
        .post()
        .json()
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
