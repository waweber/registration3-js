import { PrintAPI } from "#src/print/types.js"
import { createOptionalContext } from "#src/utils.js"

export const PrintAPIContext = createOptionalContext<PrintAPI>()
export const PrintAPIProvider = PrintAPIContext.Provider
