import { makeAutoObservable, reaction } from "mobx"
import { ReactNode, createContext, useContext, useLayoutEffect } from "react"

class TitleState {
  entries: (readonly [string | null, string | null])[] = []

  constructor() {
    makeAutoObservable(this)

    reaction(
      () => this.title,
      (title) => {
        if (title) {
          document.title = title
        }
      },
    )
  }

  setTitle(level: number, title: string | null, subtitle: string | null) {
    this.entries[level] = [title, subtitle]
  }

  unsetTitle(level: number) {
    delete this.entries[level]
    this.trim()
  }

  private trim() {
    for (let i = this.entries.length - 1; i >= 0; i--) {
      if (!this.entries[i]) {
        this.entries.splice(i, 1)
      }
    }
  }

  get title(): string | null {
    return this.entries.reduceRight(
      (p, c) => (p ? p : c[0]),
      null as string | null,
    )
  }

  get subtitle(): string | null {
    return this.entries.reduceRight(
      (p, c) => (p ? p : c[1]),
      null as string | null,
    )
  }
}

const TitleContext = createContext<readonly [TitleState, number]>([
  new TitleState(),
  0,
])

export const useTitle = (): readonly [string | null, string | null] => {
  const [ctx] = useContext(TitleContext)
  return [ctx.title, ctx.subtitle]
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
  const [state, level] = useContext(TitleContext)

  const newValue = [state, level + 1] as const

  useLayoutEffect(() => {
    state.setTitle(level, title || null, subtitle || null)
    return () => {
      state.unsetTitle(level)
    }
  }, [level, title, subtitle])

  return (
    <TitleContext.Provider value={newValue}>{children}</TitleContext.Provider>
  )
}
