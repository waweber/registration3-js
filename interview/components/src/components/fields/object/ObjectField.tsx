import { Stack, StackProps, useProps } from "@mantine/core"
import clsx from "clsx"
import { FieldContextProvider, useFieldContext } from "../context.js"
import { FieldState } from "../../../state/types.js"
import { makeFieldState } from "../../../state/field.js"
import { useState } from "react"
import { TextField } from "../text/TextField.js"

export type ObjectFieldProps = StackProps & {}

export const ObjectField = (props: ObjectFieldProps) => {
  const { className, ...other } = useProps("ObjectField", {}, props)

  const ctx = useFieldContext<Record<string, FieldState<unknown>>>()

  const [childStates] = useState(() => {
    const schemaProps = ctx?.schema.properties ?? {}
    const childStates: Record<string, FieldState<unknown>> = {}

    for (const prop of Object.keys(schemaProps)) {
      const childSchema = schemaProps[prop]
      childStates[prop] = makeFieldState(
        childSchema,
        ctx ? () => ctx.getChildValidationError(prop) : undefined,
      )
    }

    ctx?.setValue(childStates)
    return childStates
  })

  const children = []

  for (const prop of Object.keys(childStates)) {
    children.push(
      <FieldContextProvider key={prop} value={childStates[prop]}>
        {/* TODO */}
        <TextField />
      </FieldContextProvider>,
    )
  }

  return (
    <Stack className={clsx("ObjectField-root", className)} {...other}>
      {children}
    </Stack>
  )
}
