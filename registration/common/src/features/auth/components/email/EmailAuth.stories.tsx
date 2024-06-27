import { Meta, StoryObj } from "@storybook/react"
import { EmailAuth } from "./EmailAuth.js"

import { useState } from "react"
import { FullPageMenuLayout } from "#src/components/index"

const meta: Meta<typeof EmailAuth> = {
  component: EmailAuth,
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

export const Default: StoryObj<typeof EmailAuth> = {
  render() {
    const [email, setEmail] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    return (
      <EmailAuth
        email={email}
        loading={submitting}
        error={error}
        onSubmit={(value) => {
          if (submitting) {
            return
          }

          setError(null)

          if (email) {
            setSubmitting(true)
            window.setTimeout(() => {
              setError("Invalid code")
              setSubmitting(false)
            }, 500)
          } else {
            setSubmitting(true)
            window.setTimeout(() => {
              if (!value.includes("@")) {
                setError("Invalid email")
              } else {
                setEmail(value)
              }
              setSubmitting(false)
            }, 500)
          }
        }}
      />
    )
  },
}
