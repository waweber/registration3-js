import { Box, BoxProps, NavLink, NavLinkProps, useProps } from "@mantine/core"
import clsx from "clsx"
import {
  ComponentPropsWithoutRef,
  ReactNode,
  useLayoutEffect,
  useRef,
} from "react"

export type HistoryPanelItemProps = NavLinkProps & ComponentPropsWithoutRef<"a">

export type HistoryPanelProps = BoxProps & {
  children?: ReactNode
}

export const HistoryPanel = (props: HistoryPanelProps) => {
  const { className, children, ...other } = useProps("HistoryPanel", {}, props)

  return (
    <Box className={clsx("HistoryPanel-root", className)} {...other}>
      {children}
    </Box>
  )
}

HistoryPanel.Item = (props: HistoryPanelItemProps) => {
  const { className, active, ...other } = props

  const ref = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [active])

  return (
    <NavLink
      ref={ref}
      className={clsx("HistoryPanel-item", className)}
      active
      variant={active ? "light" : "subtle"}
      {...other}
    />
  )
}
