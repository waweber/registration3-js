import { ReactNode, createContext, useContext } from "react"
import { FieldState } from "../../state/types.js"

const FieldContext = createContext<FieldState<unknown> | null>(null)

export const FieldContextProvider = ({
  value,
  children,
}: {
  value: FieldState<unknown>
  children?: ReactNode
}) => <FieldContext.Provider value={value}>{children}</FieldContext.Provider>

export const useFieldContext = <T,>(): FieldState<T> | null => {
  return useContext(FieldContext) as FieldState<T> | null
}
