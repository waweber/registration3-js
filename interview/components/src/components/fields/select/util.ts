import { Schema } from "@open-event-systems/interview-lib"

export const getOptions = (
  schema: Schema,
): { value: string; label: string; primary: boolean; default: boolean }[] => {
  const options: {
    value: string
    label: string
    primary: boolean
    default: boolean
  }[] = []

  if (schema.items) {
    options.push(...getOptions(schema.items))

    const defaults = Array.isArray(schema.default) ? schema.default : []

    return options.map((opt) => ({
      ...opt,
      default: defaults.includes(opt.value),
    }))
  } else if (schema.oneOf) {
    for (const option of schema.oneOf) {
      if (option.const !== undefined) {
        const isDefault =
          schema.default !== undefined && schema.default === option.const
        options.push({
          value: String(option.const),
          label: option.title || String(option.const),
          default: isDefault,
          primary: !!option["x-primary"],
        })
      }
    }

    return options
  } else {
    return options
  }
}
