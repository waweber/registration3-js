import { PrintAPI } from "#src/print/types.js"
import { UseSuspenseQueryOptions } from "@tanstack/react-query"

export const getDocumentTypesQueryOptions = (
  printAPI: PrintAPI,
  eventId: string,
): UseSuspenseQueryOptions<Record<string, string>> => {
  return {
    queryKey: ["events", eventId, "document-types"],
    async queryFn() {
      return printAPI.listDocumentTypes(eventId)
    },
    staleTime: Infinity,
  }
}

export const getRegistrationDocumentsQueryOptions = (
  printAPI: PrintAPI,
  eventId: string,
  registrationId: string,
): UseSuspenseQueryOptions<Record<string, string>> => {
  return {
    queryKey: ["events", eventId, "registrations", registrationId, "documents"],
    async queryFn() {
      return await printAPI.listRegistrationDocuments(eventId, registrationId)
    },
  }
}
