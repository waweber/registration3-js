import { AppContext, AppContextValue } from "#src/app/context.js"
import { useRequiredContext } from "#src/utils.js"

export const useApp = (): AppContextValue => useRequiredContext(AppContext)
