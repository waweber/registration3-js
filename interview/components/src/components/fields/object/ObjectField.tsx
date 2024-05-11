import { Stack, StackProps, useProps } from "@mantine/core"
import clsx from "clsx"
import { FieldContextProvider, useFieldContext } from "../context.js"
import { useState } from "react"
import { TextField } from "../text/TextField.js"

export type ObjectFieldProps = StackProps & {}

export const ObjectField = (props: ObjectFieldProps) => {
  const { className, ...other } = useProps("ObjectField", {}, props)

  const [state, schema, path] = useFieldContext()

  const properties = schema.properties ?? {}

  const children = Object.keys(properties).map((key) => {
    return (
      <FieldContextProvider key={key} pathItem={key} schema={properties[key]}>
        {/* TODO */}
        <TextField />
      </FieldContextProvider>
    )
  })

  return (
    <Stack className={clsx("ObjectField-root", className)} {...other}>
      {children}
    </Stack>
  )
}
