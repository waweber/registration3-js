import { Button, Group, Stack } from "@mantine/core"
import { UserResponse } from "@open-event-systems/interview-lib"
import { ComponentType, useCallback, useContext, useMemo } from "react"
import { InterviewComponentProps } from "../types.js"
import clsx from "clsx"
import { InterviewContext } from "../interview/Context.js"
import { Schema } from "@open-event-systems/input-lib"
import { Form, FormFieldsProps } from "@open-event-systems/input-components"
import { Markdown } from "../markdown/Markdown.js"

export type QuestionProps = InterviewComponentProps & {
  className?: string
  schema: Schema<"object">
  initialData?: UserResponse
  fieldsComponent?: ComponentType<FormFieldsProps>
}

export const Question = (props: QuestionProps) => {
  const {
    schema,
    initialData,
    className,
    contentComponent: ContentComponent,
    fieldsComponent = Form.Fields,
  } = props
  const FieldsComponent = fieldsComponent

  const context = useContext(InterviewContext)
  const showControls = useMemo(() => !hasButtons(schema), [schema])

  const ChildComponent = useCallback(
    ({ schema }: FormFieldsProps) => {
      return (
        <ContentComponent
          title={schema.title || "Question"}
          controls={
            showControls ? (
              <Group preventGrowOverflow={false} justify="flex-end">
                <Button type="submit" variant="filled">
                  Next
                </Button>
              </Group>
            ) : undefined
          }
        >
          <Stack className={clsx("Question-content")}>
            <Markdown>{schema.description}</Markdown>
            <FieldsComponent schema={schema} />
          </Stack>
        </ContentComponent>
      )
    },
    [showControls, ContentComponent],
  )

  return (
    <Form
      schema={schema}
      className={clsx("Question-root", className)}
      initialValues={initialData}
      onSubmit={context.onSubmit}
      fieldsComponent={ChildComponent}
    />
  )
}

const hasButtons = (schema: Schema) => {
  const properties = schema.properties ?? {}
  for (const key of Object.keys(properties)) {
    const propSchema = properties[key]
    if (propSchema["x-type"] == "button") {
      return true
    }
  }
  return false
}
