import { SelfServiceAPI } from "#src/selfservice/types.js"
import { createOptionalContext } from "#src/utils.js"

export const SelfServiceAPIContext = createOptionalContext<SelfServiceAPI>()
export const SelfServiceAPIProvider = SelfServiceAPIContext.Provider
