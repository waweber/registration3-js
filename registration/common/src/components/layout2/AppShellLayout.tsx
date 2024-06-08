import {
  AppShell,
  AppShellProps,
  Box,
  Burger,
  Divider,
  Group,
  NavLink,
  Text,
  Title,
  useProps,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconChevronLeft } from "@tabler/icons-react"
import { ReactNode } from "react"

export type AppShellLayoutProps = AppShellProps & {
  navbarContent?: ReactNode
  logoSrc?: string
  showNavbar?: boolean
  onToggleNavbar?: () => void
}

export const AppShellLayout = (props: AppShellLayoutProps) => {
  const {
    classNames,
    navbarContent,
    showNavbar,
    onToggleNavbar,
    logoSrc,
    children,
    ...other
  } = useProps("AppShellLayout", {}, props)

  const small = useMediaQuery("(max-width: 48em)", {
    getInitialValueInEffect: false,
  })

  return (
    <AppShell
      classNames={{
        root: "AppShellLayout-root",
        header: "AppShellLayout-header",
        main: "AppShellLayout-main",
        ...classNames,
      }}
      layout={small ? "alt" : "default"}
      header={{
        height: 200,
        ...other.header,
      }}
      navbar={{
        width: 200,
        breakpoint: "sm",
        collapsed: {
          mobile: !showNavbar,
          ...other.navbar?.collapsed,
        },
        ...other.navbar,
      }}
      padding="md"
      {...other}
    >
      <AppShell.Header>
        <Box className="AppShellLayout-topbar">
          <Burger
            color="white"
            opened={showNavbar}
            onClick={onToggleNavbar}
            hiddenFrom="sm"
            title="Menu"
          />
          Top bar
        </Box>
        <Box className="AppShellLayout-headerContent">
          <Box className="AppShellLayout-titleArea">
            <Title className="AppShellLayout-title" order={1}>
              Title
            </Title>
            <Text className="AppShellLayout-subtitle">Subtitle</Text>
          </Box>
          {logoSrc && (
            <img src={logoSrc} alt="" className="AppShellLayout-logo" />
          )}
        </Box>
      </AppShell.Header>
      <AppShell.Navbar>
        {small && (
          <>
            <NavLink
              label="Close"
              onClick={onToggleNavbar}
              leftSection={<IconChevronLeft />}
            />
            <Divider />
          </>
        )}
        {navbarContent}
      </AppShell.Navbar>
      <AppShell.Main>
        {/* <Box component="header" className="AppShellLayout-mainHeader">
          <Box className="AppShellLayout-titleArea">
            <Title className="AppShellLayout-title" order={1}>
              Title
            </Title>
            <Text className="AppShellLayout-subtitle">Subtitle</Text>
          </Box>
          {logoSrc && (
            <img src={logoSrc} alt="" className="AppShellLayout-logo" />
          )}
        </Box> */}
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
