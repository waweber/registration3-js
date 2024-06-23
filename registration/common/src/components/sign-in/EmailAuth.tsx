import { Button, Stack, Text, TextInput, useProps } from "@mantine/core"
import { useState } from "react"
import {
  FullPageMenuLayout,
  FullPageMenuLayoutContentProps,
} from "../layout/index.js"

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
