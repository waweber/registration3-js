import { Registration } from "#src/registration/types.js"

/**
 * Format the name of a registration.
 */
export const getRegistrationName = (registration: Registration): string => {
  const fname = registration.first_name?.trim()
  const pname = registration.preferred_name?.trim()
  const lname = registration.last_name?.trim()

  const names = [pname, pname && fname ? `(${fname})` : fname, lname].filter(
    (n): n is string => Boolean(n),
  )
  const name = names.join(" ")
  return name || registration.email || registration.nickname || "Registration"
}
