import { Anchor, Menu, MenuStylesNames, useProps } from "@mantine/core"
import { IconLogout2 } from "@tabler/icons-react"
import { ReactNode } from "react"

export type UserMenuProps = {
  userName?: string | null
  onSignOut?: () => void
  onSignIn?: (id: string) => void
  signInOptions?: [{ id: string; label: string; icon?: ReactNode }]
  classNames?: { [k in MenuStylesNames]?: string }
}

export const UserMenu = (props: UserMenuProps) => {
  const {
    userName,
    onSignIn,
    onSignOut,
    signInOptions = [],
    ...other
  } = useProps("UserMenu", {}, props)

  const signInItems = signInOptions.map((opt) => (
    <Menu.Item
      key={opt.id}
      leftSection={opt.icon}
      onClick={() => onSignIn && onSignIn(opt.id)}
    >
      {opt.label}
    </Menu.Item>
  ))

  return (
    <Menu position="bottom-end" {...other}>
      <Menu.Target>
        <Anchor component="button">{userName ?? "Guest"}</Anchor>
      </Menu.Target>
      <Menu.Dropdown>
        {userName == null ? (
          <>
            <Menu.Label>Guest</Menu.Label>
            {signInItems}
          </>
        ) : (
          <>
            <Menu.Label>User</Menu.Label>
            <Menu.Item leftSection={<IconLogout2 />} onClick={onSignOut}>
              Sign Out
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}
