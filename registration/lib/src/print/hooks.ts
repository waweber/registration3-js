import { PrintAPIContext } from "#src/print/providers.js"
import {
  getDocumentTypesQueryOptions,
  getRegistrationDocumentsQueryOptions,
} from "#src/print/queries.js"
import { PrintAPI } from "#src/print/types.js"
import { useRequiredContext } from "#src/utils.js"
import { useSuspenseQuery } from "@tanstack/react-query"

export const usePrintAPI = (): PrintAPI => useRequiredContext(PrintAPIContext)

export const useDocumentTypes = (eventId: string): Record<string, string> => {
  const printAPI = usePrintAPI()
  const opts = getDocumentTypesQueryOptions(printAPI, eventId)
  const query = useSuspenseQuery(opts)
  return query.data
}

export const useRegistrationDocuments = (
  eventId: string,
  registrationId: string,
): Record<string, string> => {
  const printAPI = usePrintAPI()
  const opts = getRegistrationDocumentsQueryOptions(
    printAPI,
    eventId,
    registrationId,
  )
  const query = useSuspenseQuery(opts)
  return query.data
}
