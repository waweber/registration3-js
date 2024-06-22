import { AppShell, AppShellProps, Box, Title, useProps } from "@mantine/core"
import { Logo } from "../../logo/Logo.js"

export type SimpleMessageLayoutProps = AppShellProps & {
  title?: string
  logoSrc?: string
}

export const SimpleMessageLayout = (props: SimpleMessageLayoutProps) => {
  const { title, logoSrc, children, ...other } = useProps(
    "SimpleMessageLayout",
    {},
    props,
  )

  return (
    <AppShell
      classNames={{
        root: "SimpleMessageLayout-root",
        main: "SimpleMessageLayout-main",
      }}
      {...other}
    >
      <AppShell.Main>
        <Box component="header" className="SimpleMessageLayout-mainHeader">
          <Logo src={logoSrc} className="SimpleMessageLayout-logo" />
        </Box>
        <Box className="SimpleMessageLayout-mainContent">
          {title && (
            <Title order={1} className="SimpleMessageLayout-title">
              {title}
            </Title>
          )}
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
