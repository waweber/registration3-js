import { Registration, SelfServiceAPI } from "./types.js"

const delay = (d: number) => new Promise((r) => window.setTimeout(r, d))

export const makeMockSelfServiceAPI = (): SelfServiceAPI => {
  const registrations: Registration[] = [
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
      change_options: [
        {
          id: "upgrade",
          title: "Upgrade",
        },
      ],
    },
  ]

  return {
    async listEvents() {
      await delay(100)
      return [{ id: "example-event", name: "Example Event", open: true }]
    },
    async listRegistrations() {
      await delay(300)
      return {
        registrations: registrations,
        add_options: [
          { id: "add-full", title: "Full Weekend" },
          { id: "add-day", title: "Day Pass" },
        ],
      }
    },
    async startInterview(_eventId, _cartId, interviewId) {
      await delay(200)
      return {
        state: `${interviewId}-0`,
        completed: false,
        update_url: "",
      }
    },
    async completeInterview() {
      await delay(300)
      return {
        id: "empty",
      }
    },
    async checkAccessCode(eventId, accessCode) {
      return false
    },
  }
}
