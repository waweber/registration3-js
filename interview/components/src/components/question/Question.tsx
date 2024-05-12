import { Box, Button, Group, Stack } from "@mantine/core"
import { Schema } from "@open-event-systems/interview-lib"
import { makeFormState } from "../../state/form.js"
import { useMemo, useState } from "react"
import { ObjectField } from "../fields/object/ObjectField.js"
import { FieldContextProvider } from "../fields/context.js"
import { InterviewComponentProps } from "../types.js"
import clsx from "clsx"

export type QuestionProps = InterviewComponentProps & {
  schema: Schema
}

export const Question = (props: QuestionProps) => {
  const { schema, children } = props
  const [state] = useState(() => makeFormState(schema)) // TODO: user responses
  const [submitting, setSubmitting] = useState(false)

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

  const onSubmit = () => {
    if (submitting) {
      return
    }

    state.setTouched([])
    if (!state.validationError) {
      setSubmitting(true)
      // TODO
      window.setTimeout(() => setSubmitting(false), 2000)
    }
  }

  return (
    <FieldContextProvider state={state} schema={state.schema}>
      {children({ ...componentProps, onSubmit, submitting })}
    </FieldContextProvider>
  )
}
