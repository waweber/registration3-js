import {
  intersectScopes,
  Scope,
  SCOPE,
  ScopeDescription,
} from "#src/features/auth/scope.js"
import { Checkbox, CheckboxGroupProps, Stack } from "@mantine/core"

export type ScopeMenuProps = {
  currentScope?: Scope[]
} & Omit<CheckboxGroupProps, "children">

export const ScopeMenu = (props: ScopeMenuProps) => {
  const { size, currentScope, ...other } = props
  const scopes = [...Object.values(SCOPE)]
  const combinedScope = intersectScopes(scopes, currentScope ?? scopes)

  return (
    <Checkbox.Group label="Permissions" {...other}>
      <Stack mt="xs" gap={size}>
        {Array.from(Object.keys(SCOPE) as (keyof typeof SCOPE)[])
          .filter((s) => combinedScope.includes(SCOPE[s]))
          .map((s) => (
            <Checkbox
              size={size}
              key={SCOPE[s]}
              value={SCOPE[s]}
              label={ScopeDescription[s]}
            />
          ))}
      </Stack>
    </Checkbox.Group>
  )
}
