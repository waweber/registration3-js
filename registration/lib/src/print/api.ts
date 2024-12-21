import { PrintAPI } from "#src/print/types.js"
import { Wretch } from "wretch"

export const makePrintAPI = (wretch: Wretch): PrintAPI => {
  return {
    async listDocumentTypes(eventId) {
      return await wretch.url(`/events/${eventId}/document-types`).get().json()
    },
    async listRegistrationDocuments(eventId, registrationId) {
      return await wretch
        .url(`/events/${eventId}/registrations/${registrationId}/documents`)
        .get()
        .json()
    },
    async readDocument(url) {
      return await wretch.url(url, true).get().blob()
    },
  }
}
