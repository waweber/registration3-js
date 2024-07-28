import { LoadingOverlay, LoadingOverlayProps, useProps } from "@mantine/core"
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

const LoadingContext = createContext<(setLoading: boolean) => void>(
  () => void 0,
)

export type FullscreenLoaderProps = Omit<LoadingOverlayProps, "visible"> & {
  children?: ReactNode
}

export const FullscreenLoader = (props: FullscreenLoaderProps) => {
  const { children, loaderProps, transitionProps, ...other } = useProps(
    "FullscreenLoader",
    {},
    props,
  )

  const counter = useRef(0)
  const hideTimeout = useRef<number | null>(null)
  const [initial, setInitial] = useState(true)
  const [show, setShow] = useState(false)

  // use a delay to prevent flicker when loading changes multiple times
  const setLoadingFunc = useCallback((loading: boolean) => {
    if (loading) {
      counter.current += 1
      if (counter.current == 1) {
        if (hideTimeout.current != null) {
          window.clearTimeout(hideTimeout.current)
        }
        hideTimeout.current = null
        setShow(true)
      }
    } else {
      counter.current -= 1
      if (counter.current == 0) {
        hideTimeout.current = window.setTimeout(() => {
          setShow(false)
        }, 10)
      }
    }
  }, [])

  useEffect(() => {
    if (show) {
      setInitial(false)
    }
  }, [show])

  return (
    <LoadingContext.Provider value={setLoadingFunc}>
      {children}
      <LoadingOverlay
        classNames={{
          root: "FullscreenLoader-root",
          overlay: "FullscreenLoader-overlay",
          loader: "FullscreenLoader-loader",
        }}
        loaderProps={{
          type: "dots",
          color: "var(--mantine-primary-color-contrast)",
          ...loaderProps,
        }}
        overlayProps={{
          color: "var(--mantine-primary-color-filled)",
          backgroundOpacity: 1,
        }}
        transitionProps={{
          keepMounted: true,
          duration: initial ? 0 : 250,
          ...transitionProps,
        }}
        {...other}
        visible={show}
      />
    </LoadingContext.Provider>
  )
}

const ShowFullscreenLoader = () => {
  const setLoading = useContext(LoadingContext)

  useLayoutEffect(() => {
    setLoading(true)
    return () => setLoading(false)
  }, [])

  return <></>
}

FullscreenLoader.Show = ShowFullscreenLoader
