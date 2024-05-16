import {
  ActionIcon,
  ActionIconProps,
  AppShell,
  AppShellHeaderProps,
  Box,
  useProps,
} from "@mantine/core"
import { IconHome } from "@tabler/icons-react"
import clsx from "clsx"
import { observer } from "mobx-react-lite"
import { ComponentType } from "react"

export type HeaderProps = {
  homeUrl?: string
  homeIcon?: ComponentType<Record<string, never>> | string
  HomeIconProps?: ActionIconProps
} & AppShellHeaderProps

export const Header = observer((props: HeaderProps) => {
  const {
    className,
    homeUrl,
    homeIcon: HomeIcon,
    HomeIconProps,
    children,
    ...other
  } = useProps("Header", {}, props)

  const homeIcon = (
    <ActionIcon
      className="Header-homeIcon"
      variant="transparent"
      component="a"
      href={homeUrl ?? "/"}
      title="Home"
      {...HomeIconProps}
    >
      {typeof HomeIcon === "function" ? (
        <HomeIcon />
      ) : typeof HomeIcon === "string" ? (
        <img src={HomeIcon} alt="" />
      ) : (
        <IconHome />
      )}
    </ActionIcon>
  )

  return (
    <AppShell.Header className={clsx("Header-root", className)} {...other}>
      {homeIcon}
      <Box className="Header-content">{children}</Box>
    </AppShell.Header>
  )
})

Header.displayName = "Header"
