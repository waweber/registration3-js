import { ReactNode } from "react"
import { AppShellLayout, AppShellLayoutProps } from "./AppShellLayout.js"
import { ContainerLayout } from "./ContainerLayout.js"
import { StackLayout } from "./StackLayout.js"

export const SimpleLayout = ({
  children,
  AppShellLayoutProps,
}: {
  children?: ReactNode
  AppShellLayoutProps?: AppShellLayoutProps
}) => (
  <AppShellLayout {...AppShellLayoutProps}>
    <ContainerLayout>
      <StackLayout>{children}</StackLayout>
    </ContainerLayout>
  </AppShellLayout>
)
