import { AdminAPI } from "#src/admin/types.js"
import { makeMockWithDelay } from "#src/utils.js"

export const makeMockAdminAPI = (): AdminAPI => {
  const api: AdminAPI = {
    async startInterview() {
      return {
        completed: true,
        state: "state",
        target: "",
      }
    },
    async completeInterview() {
      return {
        registration: {
          id: "1",
          event_id: "example-event",
          status: "created",
          version: 2,
          date_created: "2020-01-01T12:00:00-05:00",
          date_updated: "2020-01-01T12:05:00-05:00",
          email: "test@example.net",
          first_name: "Example",
          last_name: "Person",
          nickname: "Example",
          number: 100,
          check_in_id: "A01",
        },
      }
    },
  }
  return makeMockWithDelay(api)
}
