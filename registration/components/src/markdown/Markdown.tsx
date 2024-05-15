import {
  Box,
  BoxProps,
  TypographyStylesProvider,
  createPolymorphicComponent,
} from "@mantine/core"
import clsx from "clsx"
import { createContext, forwardRef, useContext, useMemo } from "react"
import markdownit from "markdown-it"

export const MarkdownContext = createContext(
  markdownit({
    linkify: true,
  }),
)

export type MarkdownProps = BoxProps & {
  children?: string
}

export const Markdown = createPolymorphicComponent<"div", MarkdownProps>(
  forwardRef<HTMLDivElement, MarkdownProps>((props, ref) => {
    const { className, children, ...others } = props

    const markdown = useContext(MarkdownContext)

    const markdownHtml = useMemo(() => {
      return children ? markdown.render(children) : ""
    }, [markdown, children])

    return (
      <Box
        className={clsx("Markdown-root", className)}
        component="div"
        dangerouslySetInnerHTML={{ __html: markdownHtml }}
        {...others}
      />
    )
  }),
)

Markdown.displayName = "Markdown"
