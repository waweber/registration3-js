import { Card, NavLink, useProps } from "@mantine/core"
import { getPlatformWebAuthnDetails } from "./webauthn.js"
import { IconUserOff } from "@tabler/icons-react"
import {
  FullPageMenuLayout,
  FullPageMenuLayoutContentProps,
} from "../layout/index.js"

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
