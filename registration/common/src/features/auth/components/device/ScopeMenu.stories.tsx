import { ScopeMenu } from "#src/features/auth/components/device/ScopeMenu.js"
import { SCOPE } from "#src/features/auth/scope.js"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ScopeMenu> = {
  component: ScopeMenu,
}

export default meta

export const Default: StoryObj<typeof ScopeMenu> = {
  args: {
    currentScope: [
      SCOPE.selfService,
      SCOPE.cart,
      SCOPE.registration,
      SCOPE.registrationWrite,
      SCOPE.setEmail,
      SCOPE.admin,
    ],
  },
}
