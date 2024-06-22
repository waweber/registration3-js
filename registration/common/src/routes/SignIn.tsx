import { Outlet, useNavigate } from "@tanstack/react-router"
import {
  EmailAuth,
  FullPageMenuLayout,
  SignInMenu,
  SignInMenuProps,
  Title,
  WebAuthnRegistration,
  getPlatformWebAuthnDetails,
  getSupportsWebAuthn,
} from "../components/index.js"
import { IconMail } from "@tabler/icons-react"
import { useCallback, useState } from "react"
import { useAuth, useAuthAPI } from "../hooks/auth.js"
import { getErrorMessage } from "../utils.js"
import { makeTokenFromResponse } from "../api/token.js"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { startAuthentication, startRegistration } from "@simplewebauthn/browser"
import {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/types"

export const SignInRoute = () => {
  return (
    <Title title="Sign In">
      <FullPageMenuLayout title="Sign In">
        <Outlet />
      </FullPageMenuLayout>
    </Title>
  )
}

const SignInRouteNotFound = () => {
  return (
    <Title title="Not Found">
      <FullPageMenuLayout.Content title="Not Found">
        The page was not found.
      </FullPageMenuLayout.Content>
    </Title>
  )
}

SignInRoute.NotFound = SignInRouteNotFound

export const SignInMenuRoute = () => {
  const navigate = useNavigate()
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
            to: "./email",
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

export const SignInEmailRoute = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const webAuthnSupportQuery = useQuery({
    queryKey: ["webAuthnSupported"],
    async queryFn() {
      return await getSupportsWebAuthn()
    },
  })

  const auth = useAuth()
  const authAPI = useAuthAPI()

  const onSubmit = useCallback(
    (value: string) => {
      if (
        submitting ||
        !auth.isReady ||
        !auth.token ||
        webAuthnSupportQuery.isPending
      ) {
        return
      }
      const token = auth.token.accessToken

      setSubmitting(true)
      setError(null)

      if (email) {
        authAPI
          .verifyEmail(token, email, value)
          .then((res) => {
            if (res) {
              auth.setToken(makeTokenFromResponse(res))
              if (webAuthnSupportQuery.data) {
                navigate({
                  to: "../webauthn-register",
                })
              } else {
                auth.navigateToReturnURL()
              }
            } else {
              setSubmitting(false)
              setError("Incorrect code")
            }
          })
          .catch((e) => {
            setSubmitting(false)
            setError(getErrorMessage(e))
          })
      } else {
        authAPI
          .sendEmail(token, value)
          .then((res) => {
            setSubmitting(false)
            if (!res) {
              setError("Invalid email")
            } else {
              setEmail(value)
            }
          })
          .catch((e) => {
            setError(getErrorMessage(e))
            setSubmitting(false)
            throw e
          })
      }
    },
    [email, submitting, webAuthnSupportQuery.isPending],
  )

  return (
    <EmailAuth
      loading={submitting}
      onSubmit={onSubmit}
      email={email}
      error={error}
    />
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
