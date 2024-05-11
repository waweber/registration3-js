import { Box, BoxProps, Title, useProps } from "@mantine/core"
import clsx from "clsx"

export type QuestionProps = BoxProps & {
  classes?: {
    root?: string
    title?: string
    content?: string
    footer?: string
  }
}

export const Question = (props: QuestionProps) => {
  const { className, classes, ...other } = useProps("Question", {}, props)

  return (
    <Box className={clsx("Question-root", className, classes?.root)} {...other}>
      <Box className={clsx("Question-title", classes?.title)}>
        <Title order={3}>Full name</Title>
      </Box>
      <Box className={clsx("Question-content", classes?.content)}>Content</Box>
      <Box className={clsx("Question-footer", classes?.footer)}>Footer</Box>
    </Box>
  )
}
