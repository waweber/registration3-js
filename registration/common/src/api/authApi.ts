import { Wretch } from "wretch"
import { AuthAPI } from "./types.js"
import { formDataAddon } from "wretch/addons"

export const createAuthAPI = (wretch: Wretch): AuthAPI => {
  return {
    async createNewToken() {
      return await wretch.url("/auth/create").json({}).post().json()
    },
    async refreshToken(refreshToken) {
      return await wretch
        .url("/auth/token")
        .addon(formDataAddon)
        .formData({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        })
        .post()
        .json()
    },
  }
}
