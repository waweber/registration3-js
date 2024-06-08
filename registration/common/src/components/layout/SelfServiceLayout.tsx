import {
  ActionIcon,
  Anchor,
  AppShell,
  AppShellProps,
  Box,
  Breadcrumbs,
  Paper,
  Space,
  Tabs,
  Text,
  Title,
  useProps,
} from "@mantine/core"
import { IconChevronRight, IconHome } from "@tabler/icons-react"
import { ReactNode } from "react"

export type SelfServiceLayoutProps = Omit<AppShellProps, "title"> & {
  title?: ReactNode
  subtitle?: ReactNode
  logoSrc?: string
  homeHref?: string
  userMenu?: ReactNode
}

export const SelfServiceLayout = (props: SelfServiceLayoutProps) => {
  const {
    className,
    logoSrc,
    homeHref,
    title,
    subtitle,
    userMenu,
    children,
    ...other
  } = useProps("SelfServiceLayout", {}, props)

  return (
    <AppShell
      header={{
        height: 36,
        ...other.header,
      }}
      classNames={{
        root: "SelfServiceLayout-root",
        header: "SelfServiceLayout-header",
        main: "SelfServiceLayout-main",
      }}
      {...other}
    >
      <AppShell.Header>
        {homeHref != null && (
          <ActionIcon
            component="a"
            href=""
            variant="transparent"
            c="inherit"
            size="sm"
          >
            <IconHome />
          </ActionIcon>
        )}
        {userMenu}
      </AppShell.Header>
      <AppShell.Main>
        <Box component="header" className="SelfServiceLayout-mainHeader">
          <Box className="SelfServiceLayout-titleArea">
            <Title order={1} className="SelfServiceLayout-title">
              {title}
            </Title>
            <Text className="SelfServiceLayout-subtitle">{subtitle}</Text>
          </Box>
          <img className="SelfServiceLayout-logo" src={logoSrc} alt="" />
        </Box>
        <Box className="SelfServiceLayout-mainContent">{children}</Box>
      </AppShell.Main>
    </AppShell>
  )
}
