import { AdminAPI } from "#src/admin/types.js"
import { Wretch } from "wretch"

export const makeAdminAPI = (wretch: Wretch): AdminAPI => {
  return {
    async startInterview(url: string) {
      return await wretch.url(url, true).get().json()
    },
    async completeInterview(response) {
      await wretch
        .url(response.target, true)
        .json({ state: response.state })
        .post()
        .res()
    },
  }
}
