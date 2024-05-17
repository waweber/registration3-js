import { SelfServiceAPI } from "./types.js"

const delay = (d: number) => new Promise((r) => window.setTimeout(r, d))

export const makeMockSelfServiceAPI = (): SelfServiceAPI => {
  return {
    async listEvents() {
      await delay(100)
      return [{ id: "example-event", name: "Example Event" }]
    },
    async listRegistrations() {
      await delay(200)
      return []
    },
  }
}
