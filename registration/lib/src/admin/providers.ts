import { AdminAPI } from "#src/admin/types.js"
import { createOptionalContext } from "#src/utils.js"

export const AdminAPIContext = createOptionalContext<AdminAPI>()
export const AdminAPIProvider = AdminAPIContext.Provider
