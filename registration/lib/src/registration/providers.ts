import { RegistrationAPI } from "#src/registration/types.js"
import { createOptionalContext } from "#src/utils.js"

export const RegistrationAPIContext = createOptionalContext<RegistrationAPI>()
export const RegistrationAPIProvider = RegistrationAPIContext.Provider
