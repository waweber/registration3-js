import { PrintAPI } from "#src/print/types.js"
import { makeMockWithDelay } from "#src/utils.js"

export const makeMockPrintAPI = (): PrintAPI => {
  const api: PrintAPI = {
    async listDocumentTypes(eventId) {
      return {
        badge: "Badge",
      }
    },
    async listRegistrationDocuments(eventId, registrationId) {
      return {
        badge: "badge.pdf",
      }
    },
    async readDocument(url) {
      return new Blob()
    },
  }
  return makeMockWithDelay(api)
}
