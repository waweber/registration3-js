import { Checkbox, Grid, GridProps, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"

export type RegistrationSearchFilterValues = {
  eventId: string
  search?: string
  includeAll?: boolean
}

export type RegistrationSearchFiltersProps = {
  value?: RegistrationSearchFilterValues
  onChange?: (values: Partial<RegistrationSearchFilterValues>) => void
} & GridProps

export const RegistrationSearchFilters = (
  props: RegistrationSearchFiltersProps,
) => {
  const { value, onChange, ...other } = props

  return (
    <Grid align="center" justify="flex-end" {...other}>
      <Grid.Col span={{ base: 12, sm: "auto" }}>
        <TextInput
          leftSection={<IconSearch />}
          value={value?.search}
          onChange={(e) => onChange && onChange({ search: e.target.value })}
        />
      </Grid.Col>
      <Grid.Col span={{ base: "content" }}>
        <Checkbox
          size="sm"
          label="Show all"
          checked={value?.includeAll}
          onChange={(e) =>
            onChange && onChange({ includeAll: e.target.checked })
          }
        />
      </Grid.Col>
    </Grid>
  )
}
