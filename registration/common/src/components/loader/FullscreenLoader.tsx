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
  const loadingRef = useRef(0)
  const [initial, setInitial] = useState(true)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const setLoadingFunc = useCallback(
    (loading: boolean) => {
      if (loading) {
        loadingRef.current += 1

        if (loadingRef.current == 1) {
          setLoading(true)
          setShow(true)
        }
      } else {
        loadingRef.current -= 1
        if (loadingRef.current == 0) {
          setLoading(false)
          setInitial(false)
        }
      }
    },
    [setLoading],
  )

  // hack to prevent flickering when hide/show happens in the same render cycle
  useEffect(() => {
    if (!loading && show) {
      setShow(false)
    }
  }, [loading, show])

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

  return null
}

FullscreenLoader.Show = ShowFullscreenLoader
