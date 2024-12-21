import { AuthStore } from "#src/api/auth.js"
import { Scope } from "#src/features/auth/scope.js"
import { DeviceAuthOptions } from "#src/features/auth/types.js"

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

export type DeviceAuthCreateResponse = {
  device_code: string
  user_code: string
}

export type AuthRole = {
  title: string
  scope: Scope[]
}

export type DeviceAuthCheckResponse = {
  roles: Record<string, AuthRole>
}

export type DeviceAuthErrorResponse = {
  error: string
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
  startDeviceAuth(): Promise<DeviceAuthCreateResponse>
  checkDeviceAuth(
    authStore: AuthStore,
    userCode: string,
  ): Promise<DeviceAuthCheckResponse>
  authorizeDevice(
    authStore: AuthStore,
    userCode: string,
    options: DeviceAuthOptions,
  ): Promise<void>
  completeDeviceAuth(
    deviceCode: string,
  ): Promise<TokenResponse | DeviceAuthErrorResponse>
  refreshToken(refreshToken: string): Promise<TokenResponse | null>
}
