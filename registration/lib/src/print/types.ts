export type PrintAPI = {
  listDocumentTypes(eventId: string): Promise<Record<string, string>>
  listRegistrationDocuments(
    eventId: string,
    registrationId: string,
  ): Promise<Record<string, string>>
  readDocument(url: string): Promise<Blob>
}
