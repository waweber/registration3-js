export type Event = Readonly<{
  id: string
  name: string
  open: boolean
}>

export type Registration = Readonly<{
  id: string
  title?: string
  subtitle?: string
  description?: string
  headerImage?: string
}>

export type SelfServiceAPI = {
  listEvents(): Promise<Event[]>
  listRegistrations(): Promise<Registration[]>
}
