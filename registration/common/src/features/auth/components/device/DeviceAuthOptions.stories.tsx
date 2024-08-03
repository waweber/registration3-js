import { DeviceAuthOptions } from "#src/features/auth/components/device/DeviceAuthOptions.js"
import { SCOPE } from "#src/features/auth/scope.js"
import { DeviceAuthOptions as DeviceAuthOptionsT } from "#src/features/auth/types.js"
import { Meta, StoryObj } from "@storybook/react"
import { useReducer } from "react"

const meta: Meta<typeof DeviceAuthOptions> = {
  component: DeviceAuthOptions,
}

export default meta

export const Default: StoryObj<typeof DeviceAuthOptions> = {
  args: {
    currentScope: [
      SCOPE.selfService,
      SCOPE.cart,
      SCOPE.registration,
      SCOPE.registrationWrite,
      SCOPE.setEmail,
      SCOPE.admin,
    ],
    roles: [
      {
        id: "user",
        title: "User",
        scope: [SCOPE.selfService, SCOPE.cart],
      },
      {
        id: "admin",
        title: "Admin",
        scope: [
          SCOPE.selfService,
          SCOPE.cart,
          SCOPE.registration,
          SCOPE.registrationWrite,
          SCOPE.setEmail,
          SCOPE.admin,
        ],
      },
    ],
    w: 250,
  },
  render(args) {
    const [state, dispatch] = useReducer(reducer, {
      scope: [...(args.currentScope ?? [])],
      role: null,
      anonymous: false,
      email: null,
      pathLength: 0,
      timeLimit: null,
    } as DeviceAuthOptionsT)
    return <DeviceAuthOptions options={state} onChange={dispatch} {...args} />
  },
}

const reducer = (
  state: DeviceAuthOptionsT,
  action: Partial<DeviceAuthOptionsT>,
): DeviceAuthOptionsT => {
  return { ...state, ...action }
}
