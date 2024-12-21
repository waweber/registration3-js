import { ScopeMenu } from "#src/features/auth/components/device/ScopeMenu.js"
import { intersectScopes, SCOPE, Scope } from "#src/features/auth/scope.js"
import { DeviceAuthOptions as DeviceAuthOptionsT } from "#src/features/auth/types.js"
import {
  Checkbox,
  NumberInput,
  Select,
  Stack,
  StackProps,
  TextInput,
} from "@mantine/core"

export type Role = {
  id: string
  title: string
  scope: Scope[]
}

export type DeviceAuthOptionsProps = StackProps & {
  roles?: Role[]
  options?: DeviceAuthOptionsT
  currentScope?: Scope[]
  onChange?: (value: Partial<DeviceAuthOptionsT>) => void
}

export const DeviceAuthOptions = (props: DeviceAuthOptionsProps) => {
  const { roles, options, currentScope = [], onChange, ...other } = props

  const canSetEmail = currentScope.includes(SCOPE.setEmail)

  const scopesByRole: Record<string, string[]> = {}

  for (const role of roles ?? []) {
    scopesByRole[role.id] = intersectScopes(role.scope, currentScope)
  }

  return (
    <Stack gap="xs" {...other}>
      {roles && roles.length > 0 && (
        <Select
          label="Role"
          size="xs"
          data={roles?.map((r) => ({
            value: r.id,
            label: r.title,
          }))}
          value={options?.role}
          clearable
          onChange={(v) => {
            if (onChange) {
              const newVal: Partial<DeviceAuthOptionsT> = {}

              newVal.role = v
              if (v && scopesByRole[v]) {
                newVal.scope = [...scopesByRole[v]]
              } else {
                newVal.scope = [...currentScope]
              }

              onChange(newVal)
            }
          }}
        />
      )}
      <ScopeMenu
        size="xs"
        value={options?.scope}
        currentScope={currentScope}
        onChange={(v) => onChange && onChange({ scope: v })}
      />
      {canSetEmail && (
        <>
          <TextInput
            label="Email"
            inputMode="email"
            size="xs"
            disabled={!!options?.anonymous}
            placeholder="Current"
            value={options?.email ?? undefined}
            onChange={(e) =>
              onChange && onChange({ email: e.target.value || null })
            }
          />
          <Checkbox
            label="Anonymous"
            size="xs"
            checked={options?.anonymous}
            onChange={(e) =>
              onChange && onChange({ anonymous: e.target.checked })
            }
          />
        </>
      )}
      <NumberInput
        label="Time Limit (hrs)"
        size="xs"
        value={options?.timeLimit === null ? "" : options?.timeLimit}
        onChange={(v) =>
          onChange && onChange({ timeLimit: typeof v == "string" ? null : v })
        }
        min={0}
      />
      <NumberInput
        label="Max Sub-Auth Depth"
        size="xs"
        value={options?.pathLength}
        onChange={(v) =>
          onChange && onChange({ pathLength: typeof v == "string" ? 0 : v })
        }
        min={0}
      />
    </Stack>
  )
}
