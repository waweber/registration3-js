import { Meta, StoryObj } from "@storybook/react"
import { SelfServiceLayout } from "./SelfServiceLayout.js"

import exampleLogo from "../../../../resources/example-logo.svg"
import { IconMail } from "@tabler/icons-react"
import { UserMenu } from "../../user-menu/UserMenu.js"
import { useState } from "react"

const meta: Meta<typeof SelfServiceLayout> = {
  component: SelfServiceLayout,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<typeof SelfServiceLayout> = {
  render() {
    const [userName, setUserName] = useState<string | null>(null)

    return (
      <SelfServiceLayout
        logoSrc={exampleLogo}
        homeHref="#"
        title="Title"
        subtitle="Subtitle"
        userMenu={
          <UserMenu
            userName={userName}
            signInOptions={[
              {
                id: "email",
                label: "Sign in with email",
                icon: <IconMail />,
              },
            ]}
            onSignIn={() => setUserName("user@example.net")}
            onSignOut={() => setUserName(null)}
          />
        }
      >
        Content
      </SelfServiceLayout>
    )
  },
}
