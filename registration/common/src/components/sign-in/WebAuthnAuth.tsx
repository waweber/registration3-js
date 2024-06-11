import { Card, NavLink, useProps } from "@mantine/core"
import { getPlatformWebAuthnDetails } from "./webauthn.js"
import { IconUserOff } from "@tabler/icons-react"
import {
  FullPageMenuLayout,
  FullPageMenuLayoutContentProps,
} from "../layout/index.js"

export type WebAuthnAuthProps = Omit<
  FullPageMenuLayoutContentProps,
  "onSelect"
> & {
  _userAgent?: string
  onSelect?: (select: boolean) => void
}

export const WebAuthnAuth = (props: WebAuthnAuthProps) => {
  const { _userAgent, onSelect, ...other } = useProps("WebAuthnAuth", {}, props)

  const userAgent = _userAgent || window.navigator.userAgent

  const info = getPlatformWebAuthnDetails(userAgent)

  const Icon = info.icon

  return (
    <FullPageMenuLayout.Content title="Remember Me" {...other}>
      <Card.Section>
        <NavLink
          label={info.registerName}
          description={info.registerDescription}
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
