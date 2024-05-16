import { AppShell, AppShellProps, Box, useProps } from "@mantine/core"
import clsx from "clsx"
import { ReactNode } from "react"
import { TitleArea, TitleAreaProps } from "./TitleArea.js"
import { Header } from "./Header.js"

export type AppShellLayoutProps = {
  children?: ReactNode
  TitleAreaProps?: TitleAreaProps
} & AppShellProps

export const AppShellLayout = (props: AppShellLayoutProps) => {
  const { className, children, TitleAreaProps, header, ...other } = useProps(
    "AppShellLayout",
    {},
    props,
  )

  return (
    <AppShell
      className={clsx("AppShellLayout-root", className)}
      header={{
        height: {
          base: 48,
        },
        ...header,
      }}
      {...other}
    >
      <Header />
      <AppShell.Main className="AppShellLayout-main">
        <TitleArea {...TitleAreaProps} />
        <Box className="AppShellLayout-content">{children}</Box>
      </AppShell.Main>
    </AppShell>
  )
}
