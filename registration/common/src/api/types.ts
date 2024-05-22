export type TokenResponse = {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  scope?: string
}

export type Token = Readonly<{
  accessToken: string
  refreshToken: string | null
  expiresAt: Date | null
  getIsExpired(): boolean
}>

export type AuthAPI = {
  createNewToken(): Promise<TokenResponse>
  refreshToken(refreshToken: string): Promise<TokenResponse>
}
