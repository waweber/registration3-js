import { zodResolver } from "@hookform/resolvers/zod"
import {
  getInitialValue,
  getZodSchema,
  JSONType,
  Schema,
} from "@open-event-systems/input-lib"
import { useMemo } from "react"
import { get, useForm, UseFormReturn, useFormState } from "react-hook-form"

export type UseSchemaFormReturn = UseFormReturn<Record<string, unknown>> & {
  schema: Schema<"object">
}

export const useSchemaForm = (
  schema: Schema<"object">,
  initialValues?: Record<string, JSONType>,
): UseSchemaFormReturn => {
  const zodSchema = useMemo(() => getZodSchema(schema), [schema])
  const resolver = useMemo(() => zodResolver(zodSchema), [zodSchema])
  const defaultValues = useMemo(
    () => initialValues ?? getInitialValue(schema),
    [initialValues, schema],
  )

  const form = useForm<Record<string, unknown>>({
    resolver,
    mode: "onTouched",
    defaultValues: defaultValues,
  })

  return { ...form, schema }
}

/**
 * Hook to get the error for a field.
 */
export const useError = (name: string): string | undefined => {
  const { errors } = useFormState({ name: name })
  const error = get(errors, name)
  return error?.message
}
