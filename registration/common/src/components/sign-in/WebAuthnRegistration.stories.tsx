import { Meta, StoryObj } from "@storybook/react"
import { WebAuthnRegistration } from "./WebAuthnRegistration.js"

import { FullPageMenuLayout } from "../layout/index.js"

const meta: Meta<typeof WebAuthnRegistration> = {
  component: WebAuthnRegistration,
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

export const iPhone: StoryObj<typeof WebAuthnRegistration> = {
  name: "iPhone",
  args: {
    _userAgent: "iPhone",
  },
  render(args) {
    return <WebAuthnRegistration {...args} />
  },
}

export const Android: StoryObj<typeof WebAuthnRegistration> = {
  args: {
    _userAgent: "android",
  },
  render(args) {
    return <WebAuthnRegistration {...args} />
  },
}

export const Windows: StoryObj<typeof WebAuthnRegistration> = {
  args: {
    _userAgent: "windows",
  },
  render(args) {
    return <WebAuthnRegistration {...args} />
  },
}
