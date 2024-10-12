import {
  Registration,
  REGISTRATION_STATUS,
  RegistrationStatus,
} from "#src/features/registration/types.js"

/**
 * Format a registration's name.
 */
export const formatName = (registration: Registration): string => {
  const names = [
    registration.preferred_name || registration.first_name,
    registration.last_name,
  ].filter((v): v is string => !!v && v.length > 0)
  const name = names.join(" ")
  if (name.length > 0) {
    return name
  }
  return registration.nickname || registration.email || "Registration"
}

/**
 * Format a registration status.
 */
export const formatStatus = (status: RegistrationStatus): string => {
  switch (status) {
    case REGISTRATION_STATUS.pending:
      return "Pending"
    case REGISTRATION_STATUS.created:
      return "Created"
    case REGISTRATION_STATUS.canceled:
      return "Canceled"
    default:
      return status
  }
}
