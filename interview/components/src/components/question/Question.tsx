import { Button, Group, Stack } from "@mantine/core"
import { Schema, UserResponse } from "@open-event-systems/interview-lib"
import { makeFormState } from "../../state/form.js"
import { useContext, useMemo, useState } from "react"
import { ObjectField } from "../fields/object/ObjectField.js"
import { FieldContextProvider } from "../fields/context.js"
import { InterviewComponentProps } from "../types.js"
import clsx from "clsx"
import { InterviewContext } from "../interview/Context.js"
import { Markdown } from "../markdown/Markdown.js"

export type QuestionProps = InterviewComponentProps & {
  schema: Schema
  initialData?: UserResponse
}

export const Question = (props: QuestionProps) => {
  const { schema, initialData, children } = props

  const context = useContext(InterviewContext)
  const [state] = useState(() => makeFormState(schema, initialData))
  const showControls = useMemo(() => !hasButtons(schema), [schema])

  const componentProps = useMemo(
    () => ({
      Title() {
        return state.schema.title
      },
      Content() {
        return (
          <Stack className={clsx("Question-content")}>
            <Markdown>{state.schema.description}</Markdown>
            <ObjectField autoFocus />
          </Stack>
        )
      },
      Controls() {
        if (!showControls) {
          return null
        } else {
          return (
            <Group preventGrowOverflow={false} justify="flex-end">
              <Button type="submit" variant="filled">
                Next
              </Button>
            </Group>
          )
        }
      },
    }),
    [],
  )

  const updatedContext = {
    ...context,
    onSubmit: (userResponse?: UserResponse) => {
      if (userResponse) {
        context.onSubmit(userResponse)
      } else {
        state.setTouched([])
        if (state.validationResult.success) {
          context.onSubmit(state.validationResult.value as UserResponse)
        }
      }
    },
  }

  return (
    <InterviewContext.Provider value={updatedContext}>
      <FieldContextProvider state={state} schema={state.schema}>
        {children(componentProps)}
      </FieldContextProvider>
    </InterviewContext.Provider>
  )
}

const hasButtons = (schema: Schema) => {
  const properties = schema.properties ?? {}
  for (const key of Object.keys(properties)) {
    const propSchema = properties[key]
    if (propSchema["x-component"] == "buttons") {
      return true
    }
  }
  return false
}
