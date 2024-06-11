export type TokenResponse = {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  scope?: string
  account_id?: string | null
  email?: string | null
}

export type AuthInfo = {
  account_id?: string | null
  email?: string | null
}

export type AuthAPI = {
  createNewToken(): Promise<TokenResponse>
  readInfo(accessToken: string): Promise<AuthInfo>
  sendEmail(accessToken: string, email: string): Promise<boolean>
  verifyEmail(
    accessToken: string,
    email: string,
    code: string,
  ): Promise<TokenResponse | null>
  refreshToken(refreshToken: string): Promise<TokenResponse | null>
}
