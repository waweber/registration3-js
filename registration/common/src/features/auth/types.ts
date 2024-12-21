export type DeviceAuthOptions = {
  role: string | null
  scope: string[]
  email: string | null
  anonymous: boolean
  timeLimit: number | null
  pathLength: number
}
