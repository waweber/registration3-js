import { deviceAuthAuthorizeRoute } from "#src/app/routes/device/authorize.js"
import { FullPageMenuLayout, Title } from "#src/components/index.js"
import { DeviceAuthOptions } from "#src/features/auth/components/device/DeviceAuthOptions.js"
import { Scope } from "#src/features/auth/scope.js"
import { DeviceAuthOptions as DeviceAuthOptionsT } from "#src/features/auth/types.js"
import { useAuth, useAuthAPI } from "#src/hooks/auth.js"
import { isResponseError } from "#src/utils.js"
import {
  Alert,
  Button,
  Center,
  Loader,
  Stack,
  Text,
  TextInput,
} from "@mantine/core"
import {
  useIsMutating,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { notFound, useLocation, useRouter } from "@tanstack/react-router"
import { useEffect, useReducer, useState } from "react"

export const DeviceAuthAuthorizeRoute = () => {
  const [codeInput, setCodeInput] = useState("")
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = deviceAuthAuthorizeRoute.useNavigate()
  const location = useLocation()
  const code = location.hash

  const auth = useAuth()
  const authAPI = useAuthAPI()
  const scope = (auth.token?.scope ?? "").split(" ") as Scope[]

  const checkResult = useSuspenseQuery({
    queryKey: ["authorize", { user_code: code }],
    async queryFn() {
      const accessToken = auth.token?.accessToken
      if (code && accessToken) {
        await new Promise((r) => window.setTimeout(r, 1000))
        const res = await authAPI.checkDeviceAuth(auth, code)
        return res
      } else {
        return null
      }
    },
    staleTime: 5000,
  })

  const completeAuth = useMutation({
    mutationKey: ["authorize", { user_code: code }],
    async mutationFn({ options }: { options: DeviceAuthOptionsT }) {
      const accessToken = auth.token?.accessToken
      if (accessToken && code) {
        await authAPI.authorizeDevice(auth, code, options)
      }
    },
  })

  const submitting = useIsMutating({ mutationKey: ["authorize"] }) > 0

  const [options, dispatch] = useReducer(reducer, {
    role: null,
    scope,
    anonymous: false,
    email: null,
    pathLength: 0,
    timeLimit: null,
  } as DeviceAuthOptionsT)

  useEffect(() => {
    if (code) {
      return () => {
        setComplete(false)
        setError(null)
      }
    }
  }, [code])

  if (checkResult.data === false) {
    return <DeviceAuthAuthorizeNotFound />
  }

  let content

  if (!code) {
    content = (
      <Stack
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          if (codeInput) {
            navigate({ hash: codeInput })
          }
        }}
      >
        <TextInput
          label="Code"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
        />
        <Button type="submit" variant="filled">
          Continue
        </Button>
      </Stack>
    )
  } else if (complete) {
    content = <Alert color="green">Authorization successful.</Alert>
  } else {
    content = (
      <Stack>
        <DeviceAuthOptions
          roles={[]}
          options={options}
          onChange={dispatch}
          currentScope={scope}
        />
        {error && (
          <Text c="red" size="xs">
            {error}
          </Text>
        )}
        <Button
          variant="filled"
          disabled={submitting}
          onClick={() => {
            if (submitting) {
              return
            }

            completeAuth
              .mutateAsync({ options })
              .then(() => {
                setComplete(true)
              })
              .catch((e) => {
                if (isResponseError(e)) {
                  if (e.status == 404) {
                    setError("Code not found")
                  } else if (e.status == 403) {
                    setError("Authorization failed")
                  } else {
                    throw e
                  }
                }
              })
          }}
        >
          Authorize
        </Button>
      </Stack>
    )
  }

  return (
    <Title title="Authorize Device">
      <FullPageMenuLayout>
        <FullPageMenuLayout.Content title="Authorize Device">
          {content}
        </FullPageMenuLayout.Content>
      </FullPageMenuLayout>
    </Title>
  )
}

export const DeviceAuthAuthorizeNotFound = () => {
  return (
    <Title title="Invalid Code">
      <FullPageMenuLayout>
        <FullPageMenuLayout.Content>
          <Alert color="red" title="Invalid Code">
            The code was not valid. It may have expired.
          </Alert>
        </FullPageMenuLayout.Content>
      </FullPageMenuLayout>
    </Title>
  )
}

export const DeviceAuthAuthorizePending = () => {
  return (
    <Title title="Authorize Device">
      <FullPageMenuLayout>
        <FullPageMenuLayout.Content>
          <Center>
            <Loader type="dots" />
          </Center>
        </FullPageMenuLayout.Content>
      </FullPageMenuLayout>
    </Title>
  )
}

const reducer = (
  state: DeviceAuthOptionsT,
  action: Partial<DeviceAuthOptionsT>,
): DeviceAuthOptionsT => {
  return { ...state, ...action }
}
