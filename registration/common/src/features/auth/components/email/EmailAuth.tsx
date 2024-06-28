import { makeTokenFromResponse } from "#src/api/token.js"
import { webAuthnRegisterRoute } from "#src/app/routes/signin.js"
import {
  FullPageMenuLayout,
  FullPageMenuLayoutContentProps,
} from "#src/components/index.js"
import { getSupportsWebAuthn } from "#src/features/auth/components/webauthn/webauthn.js"
import { useAuth, useAuthAPI } from "#src/hooks/auth.js"
import { getErrorMessage } from "#src/utils.js"
import { Button, Stack, Text, TextInput, useProps } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useCallback, useState } from "react"

export type EmailAuthProps = FullPageMenuLayoutContentProps & {
  email?: string | null
  error?: string | null
  onSubmit?: (value: string) => void
}

export const EmailAuth = (props: EmailAuthProps) => {
  const { email, error, onSubmit, ...other } = useProps("EmailAuth", {}, props)

  return (
    <FullPageMenuLayout.Content {...other}>
      {email ? (
        <EmailAuth.CodeForm error={error} onSubmit={onSubmit} />
      ) : (
        <EmailAuth.EmailForm error={error} onSubmit={onSubmit} />
      )}
    </FullPageMenuLayout.Content>
  )
}

const EmailAuthEmailForm = ({
  onSubmit,
  error,
}: {
  onSubmit?: (email: string) => void
  error?: string | null
}) => {
  const [email, setEmail] = useState("")
  return (
    <Stack
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        if (email && onSubmit) {
          onSubmit(email)
        }
      }}
    >
      <Text span>Enter your email.</Text>
      <TextInput
        autoFocus
        label="Email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <Button type="submit">Continue</Button>
    </Stack>
  )
}

EmailAuth.EmailForm = EmailAuthEmailForm

const EmailAuthCodeForm = ({
  onSubmit,
  error,
}: {
  onSubmit?: (code: string) => void
  error?: string | null
}) => {
  const [code, setCode] = useState("")
  return (
    <Stack
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        if (code && onSubmit) {
          onSubmit(code)
        }
      }}
    >
      <Text span>
        We&apos;ve sent a code to your email address. Enter the code to
        continue.
      </Text>
      <TextInput
        autoFocus
        label="Code"
        autoComplete="one-time-code"
        inputMode="numeric"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        error={error}
      />
      <Button type="submit">Verify</Button>
    </Stack>
  )
}

EmailAuth.CodeForm = EmailAuthCodeForm

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
                  to: webAuthnRegisterRoute.to,
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
