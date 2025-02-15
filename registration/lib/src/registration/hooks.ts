import { useCurrentCart } from "#src/cart/hooks.js"
import { RegistrationAPIContext } from "#src/registration/providers.js"
import {
  getRegistrationQueryOptions,
  getRegistrationSearchQueryOptions,
} from "#src/registration/queries.js"
import {
  RegistrationAPI,
  RegistrationListResponse,
  RegistrationResponse,
  RegistrationSearchOptions,
} from "#src/registration/types.js"
import { useRequiredContext } from "#src/utils.js"
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"

export const useRegistrationAPI = (): RegistrationAPI =>
  useRequiredContext(RegistrationAPIContext)

export const useRegistrationSearch = (
  eventId: string,
  query?: string,
  options?: RegistrationSearchOptions,
  enabled = false,
): UseInfiniteQueryResult<InfiniteData<RegistrationListResponse>> => {
  const registrationAPI = useRegistrationAPI()
  const queryOpts = getRegistrationSearchQueryOptions(
    registrationAPI,
    eventId,
    query,
    options,
  )
  return useInfiniteQuery({
    ...queryOpts,
    enabled: enabled,
  })
}

export const useRegistrationsByCheckInId = (
  eventId: string,
): RegistrationResponse[] => {
  const registrationAPI = useRegistrationAPI()
  const opts = getRegistrationSearchQueryOptions(
    registrationAPI,
    eventId,
    undefined,
    {
      check_in_id: "",
      summary: true,
    },
  )
  const query = useInfiniteQuery(opts)
  return query.data?.pages[0].registrations ?? []
}

export const useRegistration = (
  eventId: string,
  registrationId: string,
  cartId?: string | null,
): RegistrationResponse => {
  const registrationAPI = useRegistrationAPI()
  const options = getRegistrationQueryOptions(
    registrationAPI,
    eventId,
    registrationId,
    cartId,
  )
  const result = useSuspenseQuery(options)
  return result.data
}

export const useCompleteRegistration = (
  eventId: string,
  registrationId: string,
): (() => Promise<RegistrationResponse>) => {
  const api = useRegistrationAPI()
  const queryClient = useQueryClient()
  const [currentCart] = useCurrentCart(eventId)
  const mutation = useMutation({
    mutationKey: [
      "events",
      eventId,
      "registrations",
      registrationId,
      "complete",
    ],
    async mutationFn() {
      return api.completeRegistration(eventId, registrationId, currentCart.id)
    },
    onSuccess(data) {
      queryClient.setQueryData(
        [
          "events",
          eventId,
          "registrations",
          registrationId,
          { cartId: currentCart.id },
        ],
        data,
      )
    },
  })
  return mutation.mutateAsync
}

export const useCancelRegistration = (
  eventId: string,
  registrationId: string,
): (() => Promise<RegistrationResponse>) => {
  const api = useRegistrationAPI()
  const queryClient = useQueryClient()
  const [currentCart] = useCurrentCart(eventId)
  const mutation = useMutation({
    mutationKey: ["events", eventId, "registrations", registrationId, "cancel"],
    async mutationFn() {
      return api.cancelRegistration(eventId, registrationId, currentCart.id)
    },
    onSuccess(data) {
      queryClient.setQueryData(
        [
          "events",
          eventId,
          "registrations",
          registrationId,
          { cartId: currentCart.id },
        ],
        data,
      )
    },
  })
  return mutation.mutateAsync
}
