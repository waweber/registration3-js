import { DeviceAuthDevice } from "#src/features/auth/components/device/DeviceAuthDevice.js"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof DeviceAuthDevice> = {
  component: DeviceAuthDevice,
}

export default meta

export const Default: StoryObj<typeof DeviceAuthDevice> = {
  args: {
    code: "ASDF1234",
    codeURL: "http://example.net/authorize#ASDF1234",
    authURL: "http://example.net/authorize",
    w: 250,
  },
}
