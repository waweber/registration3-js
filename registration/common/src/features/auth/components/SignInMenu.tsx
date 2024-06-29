import { makeTokenFromResponse } from "#src/api/token.js"
import { signInEmailRoute, signInMenuRoute } from "#src/app/routes/signin.js"
import {
  FullPageMenuLayout,
  FullPageMenuLayoutContentProps,
} from "#src/components/index.js"
import {
  getPlatformWebAuthnDetails,
  getSupportsWebAuthn,
} from "#src/features/auth/components/webauthn/webauthn.js"
import { useAuth, useAuthAPI } from "#src/hooks/auth.js"
import { Card, NavLink, Space, useProps } from "@mantine/core"
import { startAuthentication } from "@simplewebauthn/browser"
import { AuthenticationResponseJSON } from "@simplewebauthn/types"
import { IconMail } from "@tabler/icons-react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ReactNode } from "@tanstack/react-router"
import { useState } from "react"

export type SignInMenuProps = Omit<
  FullPageMenuLayoutContentProps,
  "children" | "onSelect"
> & {
  options?: {
    id: string
    label: string
    description?: string
    icon?: ReactNode
    error?: boolean
  }[]
  onSelect?: (id: string) => void
}

export const SignInMenu = (props: SignInMenuProps) => {
  const { options, onSelect, ...other } = useProps("SignInMenu", {}, props)

  return (
    <FullPageMenuLayout.Content title="Sign In" {...other}>
      <Card.Section>
        {options?.map((o) => (
          <NavLink
            key={o.id}
            label={o.label}
            description={o.error ? "Try again" : o.description}
            c={o.error ? "red" : undefined}
            leftSection={o.icon}
            component="button"
            onClick={() => onSelect && onSelect(o.id)}
          />
        ))}
      </Card.Section>
      <Space />
    </FullPageMenuLayout.Content>
  )
}

export const SignInMenuRoute = () => {
  const navigate = signInMenuRoute.useNavigate()
  const auth = useAuth()
  const authAPI = useAuthAPI()
  const webAuthnCredentialsQuery = useSuspenseQuery({
    queryKey: ["webAuthnAuthenticationChallenge", auth.credentialId],
    async queryFn() {
      const credentialId = auth.credentialId

      if (!credentialId) {
        return null
      }
      const support = await getSupportsWebAuthn()
      if (!support) {
        return null
      }
      return await authAPI.readWebAuthnAuthenticationChallenge(credentialId)
    },
  })
  const [webAuthnError, setWebAuthnError] = useState(false)
  const [loading, setLoading] = useState(false)

  const opts: SignInMenuProps["options"] = [
    { id: "email", label: "Sign in with email", icon: <IconMail /> },
  ]

  if (webAuthnCredentialsQuery.data) {
    const webAuthnDetails = getPlatformWebAuthnDetails(
      window.navigator.userAgent,
    )
    const Icon = webAuthnDetails.icon
    opts.splice(0, 0, {
      id: "webauthn",
      label: webAuthnDetails.name,
      description: webAuthnDetails.description,
      icon: <Icon />,
      error: webAuthnError,
    })
  }

  return (
    <SignInMenu
      options={opts}
      onSelect={(option) => {
        if (loading) {
          return
        }

        const webAuthnChallenge = webAuthnCredentialsQuery.data

        setWebAuthnError(false)

        if (option == "email") {
          navigate({
            to: signInEmailRoute.to,
          })
        } else if (option == "webauthn" && webAuthnChallenge) {
          setLoading(true)
          startAuthentication(JSON.parse(webAuthnChallenge.challenge))
            .then((res: AuthenticationResponseJSON) => {
              return authAPI
                .completeWebAuthnAuthenticationChallenge(
                  webAuthnChallenge.token,
                  { ...res },
                )
                .then((tokenResp) => {
                  const token = makeTokenFromResponse(tokenResp)
                  auth.setToken(token)
                  auth.navigateToReturnURL()
                })
            })
            .catch((e: unknown) => {
              console.error(`WebAuthn authentication failed: ${e}`)
              setWebAuthnError(true)
              setLoading(false)
            })
        }
      }}
    />
  )
}
