import { Box, Button, Group, Stack } from "@mantine/core"
import { Schema, UserResponse } from "@open-event-systems/interview-lib"
import { makeFormState } from "../../state/form.js"
import { useContext, useMemo, useState } from "react"
import { ObjectField } from "../fields/object/ObjectField.js"
import { FieldContextProvider } from "../fields/context.js"
import { InterviewComponentProps } from "../types.js"
import clsx from "clsx"
import { InterviewContext } from "../interview/Context.js"

export type QuestionProps = InterviewComponentProps & {
  schema: Schema
}

export const Question = (props: QuestionProps) => {
  const { schema, children } = props

  const context = useContext(InterviewContext)
  const [state] = useState(() => makeFormState(schema)) // TODO: user responses

  const componentProps = useMemo(
    () => ({
      Title() {
        return state.schema.title
      },
      Content() {
        return (
          <Stack className={clsx("Question-content")}>
            <Box>{state.schema.description}</Box>
            <ObjectField />
          </Stack>
        )
      },
      Controls() {
        return (
          <Group preventGrowOverflow={false} justify="flex-end">
            <Button type="submit" variant="filled">
              Next
            </Button>
          </Group>
        )
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
