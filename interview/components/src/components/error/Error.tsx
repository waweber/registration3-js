import { Button, Group } from "@mantine/core"
import { useContext } from "react"
import { InterviewComponentProps } from "../types.js"
import { InterviewContext } from "../interview/Context.js"
import { Markdown } from "../markdown/Markdown.js"

export type ErrorProps = InterviewComponentProps & {
  title: string
  message: string
}

export const Error = (props: ErrorProps) => {
  const { title, message, contentComponent: ContentComponent } = props
  const context = useContext(InterviewContext)

  return (
    <ContentComponent
      title={title}
      controls={
        <Group preventGrowOverflow={false} justify="flex-end">
          <Button onClick={() => context.onClose()} variant="outline">
            Close
          </Button>
        </Group>
      }
    >
      <Markdown>{message}</Markdown>
    </ContentComponent>
  )
}
