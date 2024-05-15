import { useLocation, useNavigate, useRouter } from "@tanstack/react-router"
import { AlertDialog, AlertDialogProps } from "./AlertDialog.js"
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { action, makeAutoObservable, observable } from "mobx"
import { observer } from "mobx-react-lite"

declare module "@tanstack/react-router" {
  interface HistoryState {
    alertDialog?: AlertOptions
  }
}

export type AlertOptions = {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

class AlertState {
  alertPromise: Promise<boolean> = Promise.resolve(false)
  alertProps: Partial<AlertDialogProps> = {}
  resolve: (result: boolean) => void = () => void 0

  constructor() {
    makeAutoObservable(this, {
      alertPromise: observable.ref,
      alertProps: observable.ref,
      resolve: observable.ref,
    })
  }

  async alert(
    showFunc: (opts: AlertOptions) => void,
    hideFunc: () => void,
    opts: AlertOptions,
  ): Promise<boolean> {
    this.alertPromise = this.alertPromise
      .catch(() => void 0)
      .then(() => {
        return new Promise<boolean>(
          action((resolve) => {
            this.resolve = resolve
            this.alertProps = {
              ...opts,
              onConfirm: opts.confirmText
                ? () => {
                    resolve(true)
                    hideFunc()
                  }
                : undefined,
              onCancel: opts.cancelText
                ? () => {
                    hideFunc()
                  }
                : undefined,
              onClose: () => {
                hideFunc()
              },
            }
            showFunc(opts)
          }),
        )
      })
    return this.alertPromise
  }
}

const AlertContext = createContext<AlertState>(new AlertState())

export type AlertHook = (opts: AlertOptions) => Promise<boolean>

export const useAlert = (): AlertHook => {
  const ctx = useContext(AlertContext)
  const navigate = useNavigate()
  const router = useRouter()
  const loc = useLocation()
  return (opts) => {
    const fullOpts = { ...opts }

    if (!fullOpts.confirmText && !fullOpts.cancelText) {
      fullOpts.cancelText = "OK"
    }

    const showFunc = (opts: AlertOptions) => {
      navigate({
        state: {
          ...loc.state,
          alertDialog: {
            ...opts,
          },
        },
      })
    }

    const hideFunc = () => {
      router.history.go(-1)
    }

    return ctx.alert(showFunc, hideFunc, fullOpts)
  }
}

export const AlertProvider = observer(
  ({ children }: { children?: ReactNode }) => {
    const [state] = useState(() => new AlertState())
    const loc = useLocation()
    const router = useRouter()
    const prevOptionsRef = useRef<AlertOptions>({})

    // cancel on close
    useEffect(() => {
      if (!loc.state.alertDialog) {
        state.resolve(false)
      }
    }, [loc.state.alertDialog])

    if (loc.state.alertDialog) {
      prevOptionsRef.current = loc.state.alertDialog
    }

    const curStateOptions = loc.state.alertDialog ?? prevOptionsRef.current

    return (
      <AlertContext.Provider value={state}>
        {children}
        <AlertDialog
          onClose={() => {
            router.history.go(-1)
          }}
          onConfirm={
            curStateOptions.confirmText
              ? () => {
                  router.history.go(-1)
                }
              : undefined
          }
          onCancel={
            curStateOptions.cancelText
              ? () => {
                  router.history.go(-1)
                }
              : undefined
          }
          {...curStateOptions}
          {...state.alertProps}
          opened={!!loc.state.alertDialog}
        />
      </AlertContext.Provider>
    )
  },
)
