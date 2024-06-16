import { Box, BoxProps, createPolymorphicComponent } from "@mantine/core"
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
  inline?: boolean
}

export const Markdown = createPolymorphicComponent<"div", MarkdownProps>(
  forwardRef<HTMLDivElement, MarkdownProps>(function Markdown(props, ref) {
    const { className, inline, children, ...others } = props

    const markdown = useContext(MarkdownContext)

    const markdownHtml = useMemo(() => {
      return children
        ? inline
          ? markdown.renderInline(children)
          : markdown.render(children)
        : ""
    }, [markdown, inline, children])

    return (
      <Box
        ref={ref}
        className={clsx("Markdown-root", className)}
        component={inline ? "span" : "div"}
        dangerouslySetInnerHTML={{ __html: markdownHtml }}
        {...others}
      />
    )
  }),
)
