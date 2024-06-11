import { Outlet, useNavigate } from "@tanstack/react-router"
import {
  EmailAuth,
  FullPageMenuLayout,
  SignInMenu,
  Title,
} from "../components/index.js"
import { IconMail } from "@tabler/icons-react"
import { useCallback, useState } from "react"
import { useAuth, useAuthAPI } from "../hooks/auth.js"
import { getErrorMessage } from "../utils.js"
import { makeTokenFromResponse } from "../api/token.js"

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
  return (
    <SignInMenu
      options={[
        { id: "email", label: "Sign in with email", icon: <IconMail /> },
      ]}
      onSelect={(option) => {
        if (option == "email") {
          navigate({
            to: "./email",
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

  const auth = useAuth()
  const authAPI = useAuthAPI()

  const onSubmit = useCallback(
    (value: string) => {
      if (submitting || !auth.isReady || !auth.token) {
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
              navigate({
                to: auth.returnURL || "/",
              })
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
    [email, submitting],
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
