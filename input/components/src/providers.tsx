import { ReactNode } from "react"
import { UseSchemaFormReturn } from "./hooks.js"
import { FormProvider } from "react-hook-form"

export const SchemaFormProvider = (
  props: UseSchemaFormReturn & { children?: ReactNode },
) => {
  const { schema, children, ...other } = props
  return <FormProvider {...other}>{children}</FormProvider>
}
