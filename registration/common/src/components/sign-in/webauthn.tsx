import {
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
} from "@simplewebauthn/browser"
import { IconBrandWindows, IconFingerprint, IconKey } from "@tabler/icons-react"
import { ComponentType } from "react"

export type PlatformWebAuthnDetails = {
  name: string
  description: string
  registerName: string
  registerDescription: string
  icon: ComponentType
}

/**
 * Get whether a platform authenticator is available.
 */
export const getSupportsWebAuthn = async (): Promise<boolean> => {
  if (!browserSupportsWebAuthn()) {
    return false
  }
  return await platformAuthenticatorIsAvailable()
}

/**
 * Get names/descriptions/icons for different platforms' WebAuthn implementation.
 */
export const getPlatformWebAuthnDetails = (
  userAgent: string,
): PlatformWebAuthnDetails => {
  if (/(iPhone|iPad)/.test(userAgent)) {
    return {
      name: "Use Touch ID",
      description: "Sign in using Touch ID",
      registerName: "Continue with Touch ID",
      registerDescription: "Stay signed in using Touch ID",
      icon: IconFingerprint,
    }
  } else if (/android/i.test(userAgent)) {
    return {
      name: "Use device",
      description: "Sign in with your phone's keyring/Touch ID",
      registerName: "Remember me",
      registerDescription: "Stay signed in using your phone's keyring/Touch ID",
      icon: IconFingerprint,
    }
  } else if (/(win32|win64|windows)/i.test(userAgent)) {
    return {
      name: "Sign in with Windows",
      description: "Use your PIN or security key",
      registerName: "Remember me",
      registerDescription: "Use your Windows account to stay signed in",
      icon: IconBrandWindows,
    }
  } else {
    return {
      name: "Use your passkey",
      description: "Sign in with a PIN, fingerprint, or security key",
      registerName: "Stay signed in with passkey",
      registerDescription: "Use your PIN, fingerprint, or security key",
      icon: IconKey,
    }
  }
}
