import { Stack, StackProps, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import QRCode from "qrcode"

export type DeviceAuthDeviceProps = {
  codeURL?: string
  authURL?: string
  code?: string
} & StackProps

export const DeviceAuthDevice = (props: DeviceAuthDeviceProps) => {
  const { codeURL, authURL, code, ...other } = props
  const [dataURL, setDataURL] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (codeURL) {
      QRCode.toDataURL(codeURL, { errorCorrectionLevel: "L" }).then((value) => {
        setDataURL(value)
      })
    }
  }, [codeURL])

  return (
    <Stack align="center" {...other}>
      <img src={dataURL} alt="" />
      <Text span c="dimmed" ta="center" size="xs">
        Scan code or visit {authURL} and enter code <strong>{code}</strong>
      </Text>
    </Stack>
  )
}
