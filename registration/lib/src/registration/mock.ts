import { RegistrationAPI } from "#src/registration/types.js"
import { makeMockWithDelay, NotFoundError } from "#src/utils.js"

const mockDate = new Date().toISOString()

export const makeMockRegistrationAPI = (): RegistrationAPI => {
  const api: RegistrationAPI = {
    async listRegistrations(eventId, query) {
      return {
        registrations: [
          {
            registration: {
              id: "1",
              event_id: eventId,
              status: "created",
              version: 1,
              date_created: mockDate,
              email: "test@example.net",
              first_name: "Example",
              last_name: "Person",
              nickname: "Example",
              number: 100,
              check_in_id: "A01",
            },
            summary: "Pick up badge",
          },
        ],
      }
    },
    async readRegistration(eventId, id) {
      if (id == "1") {
        return {
          registration: {
            id: "1",
            event_id: eventId,
            status: "created",
            version: 1,
            date_created: mockDate,
            email: "test@example.net",
            first_name: "Example",
            last_name: "Person",
            nickname: "Example",
            number: 100,
            check_in_id: "A01",
          },
          summary: "Pick up badge",
          display_data: [
            ["Extra 1", "Data 1"],
            ["Extra 2", "Data 2"],
          ],
        }
      } else {
        throw new NotFoundError()
      }
    },
    async completeRegistration(eventId, id) {
      return this.readRegistration(eventId, id)
    },
    async cancelRegistration(eventId, id) {
      return this.readRegistration(eventId, id)
    },
  }
  return makeMockWithDelay(api)
}
