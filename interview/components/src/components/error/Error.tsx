import { Box, Button, Group } from "@mantine/core"
import { useMemo } from "react"
import { InterviewComponentProps } from "../types.js"

export type ErrorProps = InterviewComponentProps & {
  title: string
  message: string
  onClose?: () => void
}

export const Error = (props: ErrorProps) => {
  const { title, message, onClose, children } = props

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
            <Button onClick={() => onClose && onClose()} variant="outline">
              Close
            </Button>
          </Group>
        )
      },
    }),
    [title, message, onClose],
  )

  return children({
    ...componentProps,
    onSubmit: () => void 0,
    submitting: false,
  })
}
