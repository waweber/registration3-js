import { RegistrationAPI } from "#src/registration/types.js"
import { makeMockWithDelay, NotFoundError } from "#src/utils.js"

const mockDate = new Date().toISOString()

export const makeMockRegistrationAPI = (): RegistrationAPI => {
  const api: RegistrationAPI = {
    async listRegistrations(eventId, query) {
      return [
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
        },
      ]
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
        }
      } else {
        throw new NotFoundError()
      }
    },
  }
  return makeMockWithDelay(api)
}
