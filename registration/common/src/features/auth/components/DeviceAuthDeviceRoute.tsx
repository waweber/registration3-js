import { makeTokenFromResponse } from "#src/api/token.js"
import { FullPageMenuLayout } from "#src/components/index.js"
import { DeviceAuthDevice } from "#src/features/auth/components/device/DeviceAuthDevice.js"
import { useAuth, useAuthAPI } from "#src/hooks/auth.js"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const DEVICE_AUTH_VALIDITY = 300000
export const DEVICE_AUTH_INTERVAL = 5000

export const DeviceAuthDeviceRoute = () => {
  const authAPI = useAuthAPI()
  const auth = useAuth()

  const codeResp = useSuspenseQuery({
    queryKey: ["auth", "token", { response_type: "device_code" }],
    async queryFn() {
      return await authAPI.startDeviceAuth()
    },
    staleTime: DEVICE_AUTH_VALIDITY,
  })

  const completeAuth = useMutation({
    mutationKey: ["auth", "token", { grant_type: "device_code" }],
    async mutationFn({ deviceCode }: { deviceCode: string }) {
      const res = await authAPI.completeDeviceAuth(deviceCode)
      if ("error" in res) {
        return res.error
      } else {
        auth.setToken(makeTokenFromResponse(res))
        auth.navigateToReturnURL()
        return null
      }
    },
  })

  const deviceCode = codeResp.data.device_code
  const code = codeResp.data.user_code

  useEffect(() => {
    if (codeResp.isStale && !codeResp.isFetching) {
      codeResp.refetch()
    }
  }, [codeResp.isFetching, codeResp.isStale])

  useEffect(() => {
    const interval = window.setInterval(() => {
      completeAuth.mutateAsync({ deviceCode })
    }, DEVICE_AUTH_INTERVAL)

    return () => {
      window.clearInterval(interval)
    }
  }, [deviceCode, completeAuth.mutateAsync])

  const url = new URL(window.location.href)
  url.pathname = "/authorize"
  const authURL = String(url)
  url.hash = `#${code}`
  const codeURL = String(url)

  return (
    <FullPageMenuLayout.Content title="Sign In From Another Device">
      <DeviceAuthDevice authURL={authURL} codeURL={codeURL} code={code} />
    </FullPageMenuLayout.Content>
  )
}
