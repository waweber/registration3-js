import { Card, NavLink, useProps } from "@mantine/core"
import { getPlatformWebAuthnDetails } from "./webauthn.js"
import { IconUserOff } from "@tabler/icons-react"
import {
  FullPageMenuLayout,
  FullPageMenuLayoutContentProps,
} from "#src/components/index"
import { useAuth, useAuthAPI } from "#src/hooks/auth"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { startRegistration } from "@simplewebauthn/browser"
import { RegistrationResponseJSON } from "@simplewebauthn/types"
import { makeTokenFromResponse } from "#src/api/token"

export type WebAuthnRegistrationProps = Omit<
  FullPageMenuLayoutContentProps,
  "onSelect"
> & {
  _userAgent?: string
  error?: boolean
  onSelect?: (select: boolean) => void
}

export const WebAuthnRegistration = (props: WebAuthnRegistrationProps) => {
  const { _userAgent, error, onSelect, ...other } = useProps(
    "WebAuthnRegistration",
    {},
    props,
  )

  const userAgent = _userAgent || window.navigator.userAgent

  const info = getPlatformWebAuthnDetails(userAgent)

  const Icon = info.icon

  return (
    <FullPageMenuLayout.Content title="Remember Me" {...other}>
      <Card.Section>
        <NavLink
          label={info.registerName}
          c={error ? "red" : undefined}
          description={error ? "Try again" : info.registerDescription}
          leftSection={<Icon />}
          component="button"
          onClick={() => onSelect && onSelect(true)}
        />
        <NavLink
          label="Don't stay signed in"
          component="button"
          leftSection={<IconUserOff />}
          onClick={() => onSelect && onSelect(false)}
        />
      </Card.Section>
    </FullPageMenuLayout.Content>
  )
}

export const SignInWebAuthnRegisterRoute = () => {
  const api = useAuthAPI()
  const auth = useAuth()
  const challengeQuery = useQuery({
    queryKey: [
      "auth",
      "webauthn",
      "register",
      { accessToken: auth.token?.accessToken },
    ],
    async queryFn() {
      return await api.readWebAuthnRegistrationChallenge(
        auth.token?.accessToken || "",
      )
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  if (!auth.token) {
    auth.navigateToReturnURL()
  }

  return (
    <WebAuthnRegistration
      loading={challengeQuery.isPending}
      error={error}
      onSelect={(choice) => {
        const challengeData = challengeQuery.data
        if (!challengeData || loading) {
          return
        }

        setError(false)

        if (choice) {
          setLoading(true)
          startRegistration(JSON.parse(challengeData.challenge))
            .then((result: RegistrationResponseJSON) => {
              return api
                .completeWebAuthnRegistration(
                  auth.token?.accessToken || "",
                  challengeData.token,
                  { ...result },
                )
                .then((tokenResponse) => {
                  const token = makeTokenFromResponse(tokenResponse)
                  auth.setToken(token)
                  auth.credentialId = result.id
                  auth.navigateToReturnURL()
                })
            })
            .catch((e: unknown) => {
              console.error(`WebAuthn registration failed: ${e}`)
              setLoading(false)
              setError(true)
            })
        } else {
          setLoading(true)
          auth.navigateToReturnURL()
        }
      }}
    />
  )
}
