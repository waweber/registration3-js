import {
  Box,
  BoxProps,
  Divider,
  Title,
  TitleProps,
  useProps,
} from "@mantine/core"
import clsx from "clsx"
import { ReactNode } from "react"

export type ContentProps = BoxProps & {
  classes?: {
    root?: string
    header?: string
    title?: string
    content?: string
    footer?: string
  }
  TitleProps?: TitleProps
  footer?: ReactNode
  children?: ReactNode
}

export const Content = (props: ContentProps) => {
  const { className, TitleProps, classes, footer, children, ...other } =
    useProps("Content", {}, props)

  return (
    <Box className={clsx("Content-root", className, classes?.root)} {...other}>
      <Box className={clsx("Content-header", classes?.header)}>
        <Title
          className={clsx("Content-title", classes?.title)}
          order={3}
          {...TitleProps}
        >
          Full name
        </Title>
        <Divider />
      </Box>
      <Box className={clsx("Content-content", classes?.content)}>
        {children}
      </Box>
      <Box className={clsx("Content-footer", classes?.footer)}>{footer}</Box>
    </Box>
  )
}
