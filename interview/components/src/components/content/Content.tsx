import {
  Box,
  BoxProps,
  Divider,
  Title,
  TitleProps,
  useProps,
} from "@mantine/core"
import clsx from "clsx"
import { ComponentPropsWithoutRef, ReactNode } from "react"

export type ContentProps = BoxProps &
  Omit<ComponentPropsWithoutRef<"div">, "title"> & {
    classNames?: {
      root?: string
      header?: string
      title?: string
      content?: string
      footer?: string
    }
    title?: ReactNode
    TitleProps?: TitleProps
    footer?: ReactNode
    children?: ReactNode
  }

export const Content = (props: ContentProps) => {
  const {
    className,
    title,
    TitleProps,
    classNames: classes,
    footer,
    children,
    ...other
  } = useProps("Content", {}, props)

  return (
    <Box className={clsx("Content-root", className, classes?.root)} {...other}>
      <Box className={clsx("Content-header", classes?.header)}>
        {title && (
          <Title
            className={clsx("Content-title", classes?.title)}
            order={3}
            {...TitleProps}
          >
            {title}
          </Title>
        )}
        <Divider />
      </Box>
      <Box className={clsx("Content-content", classes?.content)}>
        {children}
      </Box>
      {footer && (
        <Box className={clsx("Content-footer", classes?.footer)}>{footer}</Box>
      )}
    </Box>
  )
}
