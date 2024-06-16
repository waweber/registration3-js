import { Box, BoxProps, createPolymorphicComponent } from "@mantine/core"
import clsx from "clsx"
import { createContext, forwardRef, useContext, useMemo } from "react"
import markdownit from "markdown-it"
import { RenderRule } from "markdown-it/lib/renderer.mjs"

const defaultMarkdown = markdownit({ linkify: true })
const defaultRenderer: RenderRule = (tokens, idx, options, env, self) =>
  self.renderToken(tokens, idx, options)
const defaultLinkOpenRenderer =
  defaultMarkdown.renderer.rules.link_open ?? defaultRenderer

const linkOpenRenderer: RenderRule = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet("href")
  const url = new URL(href || "", window.location.href)
  const curUrl = new URL(window.location.href)
  if (url.origin != curUrl.origin) {
    tokens[idx].attrSet("target", "_blank")
    tokens[idx].content += "&#x2934;"
  }
  return defaultLinkOpenRenderer(tokens, idx, options, env, self)
}

defaultMarkdown.renderer.rules.link_open = linkOpenRenderer

export const MarkdownContext = createContext(defaultMarkdown)

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
