import {
  getSchemaValidator,
  JSONType,
  Schema,
} from "@open-event-systems/input-lib"
import { useSchemaForm } from "../../hooks.js"
import { SchemaFormProvider } from "../../providers.js"
import { FieldRenderFunc } from "../../types.js"
import { defaultRenderField } from "../../fields.js"
import { ReactNode, useCallback, useMemo } from "react"

export type FormProps = {
  schema: Schema<"object">
  initialValues?: Record<string, JSONType>
  onSubmit?: (values: Record<string, JSONType>) => void | Promise<void>
  className?: string
  renderField?: FieldRenderFunc
  children?: (fields: ReactNode) => ReactNode
}

export const Form = (props: FormProps) => {
  const { schema, initialValues, onSubmit, className, children, renderField } =
    props

  const form = useSchemaForm(schema, initialValues)
  const { handleSubmit } = form

  const validator = useMemo(() => getSchemaValidator(schema), [schema])

  const submitFunc = useCallback(
    (values: Record<string, unknown>) => {
      const validated = validator(values)
      if (onSubmit && validated.success) {
        return onSubmit(validated.data as Record<string, JSONType>)
      }
    },
    [onSubmit, schema, validator],
  )

  return (
    <SchemaFormProvider {...form}>
      <form className={className} onSubmit={handleSubmit(submitFunc)}>
        <FormContent schema={schema} renderField={renderField}>
          {children}
        </FormContent>
      </form>
    </SchemaFormProvider>
  )
}

const FormContent = ({
  schema,
  children = (c) => c,
  renderField = defaultRenderField,
}: {
  schema: Schema<"object">
  children?: (fields: ReactNode) => ReactNode
  renderField?: FieldRenderFunc
}) => {
  const objProps = schema.properties ?? {}

  const els = Object.keys(objProps).map((p) => {
    const propSchema = objProps[p]
    const el = renderField({ name: p, schema: propSchema, renderField }, p)
    return el
  })

  return children(els)
}
