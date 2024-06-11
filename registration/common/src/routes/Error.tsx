import { Text } from "@mantine/core"
import { SimpleMessageLayout, Title } from "../components/index.js"
import { isNotFound } from "../utils.js"

export const NotFound = () => {
  return (
    <Title title="Not Found">
      <SimpleMessageLayout title="Not Found">
        The requested page was not found.
      </SimpleMessageLayout>
    </Title>
  )
}

export const Error = ({ error }: { error: unknown }) => {
  if (isNotFound(error)) {
    return <NotFound />
  }

  return (
    <Title title="Error">
      <SimpleMessageLayout title="Error">
        <Text>An unexpected error occurred. Please go back and try again.</Text>
      </SimpleMessageLayout>
    </Title>
  )
}
