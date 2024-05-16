import { IObservableValue, action, makeAutoObservable, observable } from "mobx"
import {
  ReactNode,
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react"

class TitleState {
  title: IObservableValue<readonly [string | null, string | null]>[] = []

  constructor() {
    makeAutoObservable(this)
  }
}

const TitleContext = createContext<TitleState>(new TitleState())

export const useTitle = (): readonly [string | null, string | null] => {
  const ctx = useContext(TitleContext)
  const title = ctx.title.reduceRight(
    (p, c) => (p ? p : c.get()[0]),
    null as string | null,
  )
  const subtitle = ctx.title.reduceRight(
    (p, c) => (p ? p : c.get()[1]),
    null as string | null,
  )
  return [title, subtitle]
}

export const Title = ({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title?: string
  subtitle?: string
}) => {
  const state = useContext(TitleContext)
  const [localState] = useState(() =>
    observable.box([title ?? null, subtitle ?? null] as const),
  )

  useLayoutEffect(
    action(() => {
      state.title.splice(0, 0, localState)
      console.log([...state.title.map((v) => [...v.get()])])

      return action(() => {
        const idx = state.title.findIndex((v) => v == localState)
        state.title.splice(idx, 1)
        console.log([...state.title.map((v) => [...v.get()])])
      })
    }),
    [],
  )

  useLayoutEffect(
    action(() => {
      localState.set([title ?? null, subtitle ?? null])
    }),
    [title, subtitle],
  )

  return children
}
