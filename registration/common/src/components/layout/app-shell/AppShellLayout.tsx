import {
  AppShell,
  Burger,
  Button,
  NavLink,
  NavLinkProps,
  Title,
} from "@mantine/core"
import { createLink } from "@tanstack/react-router"
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react"

import "./AppShellLayout.scss"

declare module "@tanstack/react-router" {
  interface HistoryState {
    appShellMenuOpened?: boolean
  }
}

export type AppShellLayoutProps = {
  children?: ReactNode
  title?: ReactNode
  links?: ReactNode
  user?: ReactNode
  menuOpened?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export const AppShellLayout = (props: AppShellLayoutProps) => {
  const {
    children,
    links,
    title,
    user,
    menuOpened = false,
    onOpen,
    onClose,
  } = props

  return (
    <AppShell
      header={{ height: 48 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !menuOpened, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header className="AppShellLayout-header">
        <Burger
          className="AppShellLayout-button"
          opened={menuOpened}
          onClick={menuOpened ? onClose : onOpen}
          hiddenFrom="sm"
          size="sm"
        />
        <Title className="AppShellLayout-title" order={3} component="h1">
          {title}
        </Title>
        <Button className="AppShellLayout-user" variant="transparent">
          {user}
        </Button>
      </AppShell.Header>
      <AppShell.Navbar>{links}</AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}

const _NavLink = forwardRef<
  HTMLAnchorElement,
  NavLinkProps & ComponentPropsWithoutRef<"a">
>((props, ref) => {
  return <NavLink ref={ref} {...props} />
})

const AppShellNavLink = createLink(_NavLink)

AppShellLayout.NavLink = AppShellNavLink
