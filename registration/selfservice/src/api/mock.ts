import { SelfServiceAPI } from "./types.js"

const delay = (d: number) => new Promise((r) => window.setTimeout(r, d))

export const makeMockSelfServiceAPI = (): SelfServiceAPI => {
  return {
    async listEvents() {
      await delay(100)
      return [{ id: "example-event", name: "Example Event", open: true }]
    },
    async listRegistrations() {
      await delay(300)
      return [
        {
          id: "mock-registration-1",
          title: "Copley Deer",
          subtitle: "Sponsor",
          description: "Sponsor level registration.",
        },
        {
          id: "mock-registration-2",
          title: "Attendee 2",
          subtitle: "Attendee",
          description: "Standard registration.",
        },
      ]
    },
  }
}
