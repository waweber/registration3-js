import {
  getSchemaValidator,
  JSONType,
  Schema,
} from "@open-event-systems/input-lib"
import { useSchemaForm } from "../../hooks.js"
import { SchemaFormProvider } from "../../providers.js"
import { FieldProps } from "../../types.js"
import { DefaultFieldComponent } from "../../fields.js"
import { ComponentType, useCallback, useMemo } from "react"

export type FormProps = {
  schema: Schema<"object">
  initialValues?: Record<string, JSONType>
  onSubmit?: (values: Record<string, JSONType>) => void | Promise<void>
  className?: string
  autoFocus?: boolean
  fieldsComponent?: ComponentType<FormFieldsProps>
  fieldComponent?: ComponentType<FieldProps>
}

export type FormFieldsProps = {
  schema: Schema<"object">
  autoFocus?: boolean
  fieldComponent?: ComponentType<FieldProps>
}

export const Form = (props: FormProps) => {
  const {
    schema,
    initialValues,
    onSubmit,
    className,
    autoFocus,
    fieldsComponent = Form.Fields,
    fieldComponent,
  } = props
  const FieldsComponent = fieldsComponent

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
        <FieldsComponent
          schema={schema}
          fieldComponent={fieldComponent}
          autoFocus={autoFocus}
        />
      </form>
    </SchemaFormProvider>
  )
}

const FormFields = ({
  schema,
  autoFocus,
  fieldComponent = DefaultFieldComponent,
}: FormFieldsProps) => {
  const objProps = schema.properties ?? {}
  const FieldComponent = fieldComponent

  const els = Object.keys(objProps).map((p, i) => {
    const propSchema = objProps[p]
    return (
      <FieldComponent
        key={p}
        name={p}
        schema={propSchema}
        fieldComponent={FieldComponent}
        autoFocus={autoFocus && i == 0}
      />
    )
  })

  return els
}

Form.Fields = FormFields
