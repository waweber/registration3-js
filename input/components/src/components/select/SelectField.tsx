import {
  Checkbox,
  MultiSelect,
  MultiSelectProps,
  Radio,
  Select,
  SelectProps,
  Stack,
} from "@mantine/core"
import { FieldProps } from "../../types.js"
import { isType, Schema } from "@open-event-systems/input-lib"
import { useController, useFormContext } from "react-hook-form"
import { useError } from "../../hooks.js"
import { ComponentType } from "react"

export type SelectFieldProps = FieldProps & {
  getSelectComponent?: (props: SelectFieldProps) => ComponentType<FieldProps>
}

export const SelectField = (props: SelectFieldProps) => {
  const { getSelectComponent = defaultGetSelectComponent, ...other } = props
  const Component = getSelectComponent(other)
  return <Component {...other} />
}

export const defaultGetSelectComponent = (
  props: SelectFieldProps,
): ComponentType<FieldProps> => {
  const { schema } = props
  const cType = schema["x-component"]

  if (cType == "checkbox") {
    return CheckboxSelectField
  } else if (cType == "radio") {
    return RadioSelectField
  } else {
    if (isMulti(schema)) {
      return MultiDropdownSelectField
    } else {
      return DropdownSelectField
    }
  }
}

export const DropdownSelectField = (props: SelectProps & FieldProps) => {
  const { name, schema, ...other } = props

  const { setValue } = useFormContext()
  const { field } = useController({ name: name })
  const options = getOptions(schema)
  const clearable = isOptional(schema)
  const error = useError(name)

  return (
    <Select
      classNames={{
        root: "DropdownSelectField-root",
      }}
      ref={field.ref}
      name={field.name}
      label={schema.title}
      autoComplete={schema["x-autoComplete"]}
      data={options}
      clearable={clearable}
      allowDeselect={clearable}
      value={field.value}
      onChange={(v) => {
        setValue(name, v, { shouldValidate: true })
      }}
      error={error}
      {...other}
    />
  )
}

export const MultiDropdownSelectField = (
  props: MultiSelectProps & FieldProps,
) => {
  const { name, schema, ...other } = props

  const { setValue } = useFormContext()
  const { field } = useController({ name: name })
  const options = getOptions(schema)
  const clearable = isOptional(schema)
  const error = useError(name)

  return (
    <MultiSelect
      classNames={{
        root: "MultiDropdownSelectField-root",
      }}
      ref={field.ref}
      name={field.name}
      label={schema.title}
      autoComplete={schema["x-autoComplete"]}
      data={options}
      clearable={clearable}
      value={field.value}
      onChange={(v) => {
        setValue(name, v, { shouldValidate: true })
      }}
      error={error}
      {...other}
    />
  )
}

export const CheckboxSelectField = (props: FieldProps) => {
  const { name, schema } = props

  const { setValue } = useFormContext()
  const { field } = useController({
    name: name,
  })
  const options = getOptions(schema)
  const error = useError(name)

  return (
    <Checkbox.Group
      ref={field.ref}
      value={field.value}
      label={schema.title}
      onChange={(v) => {
        setValue(name, v, { shouldValidate: true })
      }}
      error={error}
    >
      <Stack mt="xs" mb="xs">
        {options.map((o) => (
          <Checkbox key={o.value} value={o.value} label={o.label} />
        ))}
      </Stack>
    </Checkbox.Group>
  )
}

export const RadioSelectField = (props: FieldProps) => {
  const { name, schema } = props

  const { setValue } = useFormContext()
  const { field } = useController({
    name: name,
  })
  const options = getOptions(schema)
  const error = useError(name)

  return (
    <Radio.Group
      label={schema.title}
      ref={field.ref}
      name={field.name}
      value={field.value}
      onChange={(v) => {
        setValue(name, v, { shouldValidate: true })
      }}
      error={error}
    >
      <Stack mt="xs" mb="xs">
        {options.map((o) => (
          <Radio key={o.value} value={o.value} label={o.label} />
        ))}
      </Stack>
    </Radio.Group>
  )
}

const getOptions = (schema: Schema): { value: string; label: string }[] => {
  if (isType(schema, "array")) {
    return (
      schema.items?.oneOf
        ?.filter((s) => s.const !== undefined)
        .map((s) => ({
          value: String(s.const),
          label: s.title ?? String(s.const) ?? "",
        })) ?? []
    )
  } else {
    return (
      schema.oneOf
        ?.filter((s) => s.const !== undefined)
        .map((s) => ({
          value: String(s.const),
          label: s.title ?? String(s.const) ?? "",
        })) ?? []
    )
  }
}

const isOptional = (schema: Schema): boolean =>
  isType(schema, "null") || (isType(schema, "array") && schema.minItems == 0)

const isMulti = (schema: Schema): boolean =>
  isType(schema, "array") && schema.maxItems != null && schema.maxItems > 1
