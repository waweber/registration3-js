import { Box, Button, Group } from "@mantine/core"
import { useContext, useMemo } from "react"
import { InterviewComponentProps } from "../types.js"
import { InterviewContext } from "../interview/Context.js"

export type ErrorProps = InterviewComponentProps & {
  title: string
  message: string
}

export const Error = (props: ErrorProps) => {
  const { title, message, children } = props
  const context = useContext(InterviewContext)

  const componentProps = useMemo(
    () => ({
      Title() {
        return title
      },
      Content() {
        return <Box>{message}</Box>
      },
      Controls() {
        return (
          <Group preventGrowOverflow={false} justify="flex-end">
            <Button onClick={() => context.onClose()} variant="outline">
              Close
            </Button>
          </Group>
        )
      },
    }),
    [title, message, context.onClose],
  )

  return children(componentProps)
}