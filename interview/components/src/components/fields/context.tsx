import { ReactNode, createContext, useContext } from "react"
import { FormState, Path } from "../../state/types.js"
import { Schema } from "@open-event-systems/interview-lib"

const FieldContext = createContext<
  [FormState, Schema, Path] | [null, Record<string, never>, []]
>([null, {}, []])

export const FieldContextProvider = ({
  state,
  schema,
  pathItem,
  children,
}: {
  state?: FormState
  schema?: Schema
  pathItem?: string | number
  children?: ReactNode
}) => {
  const [curState, curSchema, curPath] = useFieldContext()
  const newState = state ?? curState
  let newValue: [FormState, Schema, Path] | [null, Record<string, never>, []]

  if (newState) {
    const newPath = pathItem != null ? [...curPath, pathItem] : curPath
    newValue = [newState, schema ?? curSchema, newPath]
  } else {
    newValue = [null, {}, []]
  }

  return (
    <FieldContext.Provider value={newValue}>{children}</FieldContext.Provider>
  )
}

export const useFieldContext = ():
  | [FormState, Schema, Path]
  | [null, Record<string, never>, []] => {
  return useContext(FieldContext)
}
