import {
  AppShell,
  AppShellProps,
  Card,
  CardProps,
  LoadingOverlay,
  Text,
  useProps,
} from "@mantine/core"
import { Logo } from "../../logo/Logo.js"

export type FullPageMenuLayoutProps = AppShellProps & {
  logoSrc?: string
}

export const FullPageMenuLayout = (props: FullPageMenuLayoutProps) => {
  const { logoSrc, children, ...other } = useProps(
    "FullPageMenuLayout",
    {},
    props,
  )

  return (
    <AppShell
      classNames={{
        root: "FullPageMenuLayout-root",
        main: "FullPageMenuLayout-main",
      }}
      padding="xs"
      {...other}
    >
      <AppShell.Main>
        <Logo className="FullPageMenuLayout-logo" src={logoSrc} />
        {children}
      </AppShell.Main>
    </AppShell>
  )
}

export type FullPageMenuLayoutContentProps = CardProps & {
  title?: string
  loading?: boolean
}

const FullPageMenuLayoutContent = (props: FullPageMenuLayoutContentProps) => {
  const { title, loading, children, ...other } = useProps(
    "FullPageMenuLayoutContent",
    {},
    props,
  )

  return (
    <Card
      classNames={{
        root: "FullPageMenuLayout-content",
        section: "FullPageMenuLayout-contentSection",
      }}
      padding="xs"
      shadow="md"
      {...other}
    >
      {title && (
        <Text component="h1" className="FullPageMenuLayout-title">
          {title}
        </Text>
      )}
      {children}
      <LoadingOverlay visible={loading} />
    </Card>
  )
}

FullPageMenuLayout.Content = FullPageMenuLayoutContent

export default FullPageMenuLayout
