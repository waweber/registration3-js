export type TokenResponse = {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  scope?: string
}

export type AuthInfo = {
  account_id?: string | null
  email?: string | null
}

export type AuthAPI = {
  createNewToken(): Promise<TokenResponse>
  readInfo(accessToken: string): Promise<AuthInfo>
  refreshToken(refreshToken: string): Promise<TokenResponse | null>
}
