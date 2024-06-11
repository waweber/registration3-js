import { Meta, StoryObj } from "@storybook/react"
import { WebAuthnAuth } from "./WebAuthnAuth.js"

import { FullPageMenuLayout } from "../layout/index.js"

const meta: Meta<typeof WebAuthnAuth> = {
  component: WebAuthnAuth,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <FullPageMenuLayout>
        <Story />
      </FullPageMenuLayout>
    ),
  ],
}

export default meta

export const iPhone: StoryObj<typeof WebAuthnAuth> = {
  name: "iPhone",
  args: {
    _userAgent: "iPhone",
  },
  render(args) {
    return <WebAuthnAuth {...args} />
  },
}

export const Android: StoryObj<typeof WebAuthnAuth> = {
  args: {
    _userAgent: "android",
  },
  render(args) {
    return <WebAuthnAuth {...args} />
  },
}

export const Windows: StoryObj<typeof WebAuthnAuth> = {
  args: {
    _userAgent: "windows",
  },
  render(args) {
    return <WebAuthnAuth {...args} />
  },
}
