import { Registration } from "#src/registration/types.js"

/**
 * Format the name of a registration.
 */
export const getRegistrationName = (
  registration: Partial<Registration>,
): string => {
  const fname = registration.first_name?.trim()
  const pname = registration.preferred_name?.trim()
  const lname = registration.last_name?.trim()

  const names = [fname, pname && fname ? `(${pname})` : pname, lname].filter(
    (n): n is string => Boolean(n),
  )
  const name = names.join(" ")
  return name || registration.email || registration.nickname || "Registration"
}
