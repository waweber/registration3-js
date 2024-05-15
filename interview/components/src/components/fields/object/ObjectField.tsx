import { Stack, StackProps, useProps } from "@mantine/core"
import clsx from "clsx"
import { FieldContextProvider, useFieldContext } from "../context.js"
import { Field } from "../Field.js"

export type ObjectFieldProps = StackProps

export const ObjectField = (props: ObjectFieldProps) => {
  const { className, autoFocus, ...other } = useProps("ObjectField", {}, props)

  const ctx = useFieldContext()
  const schema = ctx[1]

  const properties = schema.properties ?? {}

  const children = Object.keys(properties).map((key, i) => {
    return (
      <FieldContextProvider key={key} pathItem={key} schema={properties[key]}>
        <Field autoFocus={autoFocus && i == 0 ? true : undefined} />
      </FieldContextProvider>
    )
  })

  return (
    <Stack className={clsx("ObjectField-root", className)} {...other}>
      {children}
    </Stack>
  )
}
