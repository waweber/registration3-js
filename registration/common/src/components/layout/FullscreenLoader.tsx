import {
  Box,
  BoxProps,
  Loader,
  LoadingOverlay,
  LoadingOverlayProps,
  useProps,
} from "@mantine/core"
import clsx from "clsx"
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
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
  const { className, children, ...other } = useProps(
    "FullscreenLoader",
    {},
    props,
  )
  const loadingRef = useRef(0)
  const [loading, setLoading] = useState(false)

  const setLoadingFunc = useCallback(
    (loading: boolean) => {
      if (loading) {
        loadingRef.current += 1

        if (loadingRef.current == 1) {
          setLoading(true)
        }
      } else {
        loadingRef.current -= 1
        if (loadingRef.current == 0) {
          setLoading(false)
        }
      }
    },
    [setLoading],
  )

  return (
    <LoadingContext.Provider value={setLoadingFunc}>
      {children}
      <LoadingOverlay
        className={clsx("FullscreenLoader-root", className)}
        classNames={{
          overlay: "FullscreenLoader-overlay",
        }}
        loaderProps={{
          type: "dots",
        }}
        overlayProps={{
          backgroundOpacity: 1,
        }}
        {...other}
        visible={loading}
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
