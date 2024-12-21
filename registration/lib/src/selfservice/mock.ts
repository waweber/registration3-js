import { Event, Registration, SelfServiceAPI } from "#src/selfservice/types.js"
import { makeMockWithDelay } from "#src/utils.js"

export const makeMockSelfServiceAPI = (
  events: Event[],
  store?: Map<string, Registration>,
): SelfServiceAPI => {
  store = store ?? new Map()
  const mock: SelfServiceAPI = {
    async listEvents() {
      return events
    },
    async listRegistrations() {
      const regs = Array.from(store.values())
      return {
        registrations: regs,
      }
    },
    async startInterview(url) {
      return {
        completed: false,
        state: `${url}-0`,
        target: url,
      }
    },
    async checkAccessCode(eventId, accessCode) {
      return true
    },
    async completeInterview(response) {
      return { id: "empty" }
    },
  }
  return makeMockWithDelay(mock)
}
