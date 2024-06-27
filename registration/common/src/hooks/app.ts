import { AppContext, AppContextValue } from "#src/app/context"
import { useRequiredContext } from "#src/utils"

export const useApp = (): AppContextValue => useRequiredContext(AppContext)
