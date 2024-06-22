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

export type WebAuthnChallenge = {
  token: string
  challenge: string
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
  readWebAuthnRegistrationChallenge(
    accessToken: string,
  ): Promise<WebAuthnChallenge>
  completeWebAuthnRegistration(
    accessToken: string,
    token: string,
    response: Record<string, unknown>,
  ): Promise<TokenResponse>
  readWebAuthnAuthenticationChallenge(
    credentialId: string,
  ): Promise<WebAuthnChallenge | null>
  completeWebAuthnAuthenticationChallenge(
    token: string,
    response: Record<string, unknown>,
  ): Promise<TokenResponse>
  refreshToken(refreshToken: string): Promise<TokenResponse | null>
}
