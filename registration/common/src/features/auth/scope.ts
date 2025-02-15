export const SCOPE = {
  selfService: "self-service",
  cart: "cart",
  registration: "registration",
  registrationWrite: "registration:write",
  setEmail: "auth:set-email",
  setRole: "auth:set-role",
  admin: "admin",
  adminWrite: "admin:write",
} as const

export type Scope = (typeof SCOPE)[keyof typeof SCOPE]

export const ScopeDescription: {
  readonly [S in keyof typeof SCOPE]: string
} = {
  selfService: "Manage one's own registrations",
  cart: "Create and checkout carts",
  registration: "View/search registration data",
  registrationWrite: "Create/edit registrations",
  setEmail: "Authorize a different user",
  setRole: "Set user role",
  admin: "Admin access",
  adminWrite: "Update admin settings",
}

/**
 * Return the intersection of two scope arrays.
 */
export const intersectScopes = (a: Scope[], b: Scope[]): Scope[] => {
  return a.filter((s) => b.includes(s))
}
