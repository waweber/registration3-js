import { Card, NavLink, useProps } from "@mantine/core"
import { ReactNode } from "@tanstack/react-router"
import {
  FullPageMenuLayout,
  FullPageMenuLayoutContentProps,
} from "../layout/index.js"

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
    </FullPageMenuLayout.Content>
  )
}
