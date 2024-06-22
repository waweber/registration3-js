import { Title } from "@open-event-systems/registration-common/components"
import { useEvent } from "../hooks/api.js"
import {
  addRegistrationRoute,
  cartRoute,
  changeRegistrationRoute,
} from "./index.js"
import { Suspense, useCallback, useLayoutEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router"
import { InterviewResponseRecord } from "@open-event-systems/interview-lib"
import {
  Interview,
  InterviewPanel,
  useInterviewAPI,
} from "@open-event-systems/interview-components"
import { Skeleton } from "@mantine/core"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { isResponseError } from "@open-event-systems/registration-common"
import { useCurrentCart } from "../cart/hooks.js"
import { useApp } from "../appContext.js"
import { getCartQueryOptions } from "../cart/queries.js"
import { registrationsRoute } from "./RegistrationsPage.js"

export const AddRegistrationPage = () => {
  const { eventId, interviewId } = addRegistrationRoute.useParams()

  return (
    <Title title="New Registration" subtitle="Add a new registration">
      <Suspense fallback={<Skeleton h={300} />}>
        <InterviewPage
          key={eventId}
          eventId={eventId}
          interviewId={interviewId}
          recordFromRoute={addRegistrationRoute.useLoaderData()}
        />
      </Suspense>
    </Title>
  )
}

export const ChangeRegistrationPage = () => {
  const { eventId, interviewId, registrationId } =
    changeRegistrationRoute.useParams()
  useEvent(eventId)

  return (
    <Title title="Change Registration" subtitle="Change a registration">
      <Suspense fallback={<Skeleton h={300} />}>
        <InterviewPage
          key={eventId}
          eventId={eventId}
          interviewId={interviewId}
          registrationId={registrationId}
          recordFromRoute={addRegistrationRoute.useLoaderData()}
        />
      </Suspense>
    </Title>
  )
}

const InterviewPage = ({
  eventId,
  interviewId,
  registrationId,
  recordFromRoute,
}: {
  eventId: string
  interviewId: string
  registrationId?: string
  recordFromRoute?: InterviewResponseRecord
}) => {
  const loc = useLocation()

  const [currentCart, setCurrentCart] = useCurrentCart(eventId)

  // keep using this cart ID until unmounted
  const curCartIdRef = useRef(currentCart.id)

  // prevent starting a new interview after completion between navigate and rerender
  const curStateRef = useRef<string | null>(null)

  const cartId = curCartIdRef.current
  const navigate = useNavigate()
  const router = useRouter()
  const appCtx = useApp()
  const { selfServiceAPI: selfService } = appCtx
  const queryClient = useQueryClient()

  const locStateId = getStateId(loc.hash)
  const accessCode = getAccessCode(loc.hash)
  const [latestRecordId, setLatestRecordId] = useState<string | null>(null)

  const [interviewAPI, interviewStore] = useInterviewAPI()

  const cartQueries = getCartQueryOptions(appCtx)
  const initialInterviewRecord = useQuery({
    ...cartQueries.initialInterviewRecord(
      eventId,
      cartId,
      interviewId,
      registrationId,
      accessCode,
    ),
    enabled: !recordFromRoute && !curStateRef.current && !locStateId,
  })
  const curInterviewRecord = useQuery({
    ...cartQueries.interviewRecord(curStateRef.current || locStateId || ""),
    enabled: (!recordFromRoute && !!curStateRef.current) || !!locStateId,
  })
  const interviewRecord =
    recordFromRoute || curInterviewRecord.data || initialInterviewRecord.data

  useLayoutEffect(() => {
    if (!curStateRef.current && !locStateId && interviewRecord) {
      navigate({
        hash: `s=${interviewRecord.response.state}`,
        replace: true,
      })
    }
  }, [recordFromRoute, curStateRef.current ?? locStateId, interviewRecord])

  if (locStateId) {
    curStateRef.current = locStateId
  }

  const onNavigate = useCallback(
    (state: string) => {
      navigate({
        hash: `s=${state}`,
      })
    },
    [navigate],
  )
  const onClose = useCallback(() => {
    navigate({
      to: registrationsRoute.to,
      params: {
        eventId: eventId,
      },
    })
  }, [navigate, eventId])

  const onUpdate = useCallback(
    async (record: InterviewResponseRecord) => {
      if (record.response.completed) {
        try {
          const res = await selfService.completeInterview(record.response.state)
          curStateRef.current = record.response.state
          navigate({
            to: cartRoute.to,
            params: {
              eventId: eventId,
            },
          })
          setCurrentCart(res)
        } catch (e) {
          if (isResponseError(e)) {
            if (e.status == 409) {
              throw new Error(
                "This registration has been changed and is out of date. " +
                  "Please start over to work with the latest version.",
              )
            } else if (e.status == 404) {
              throw new Error(
                "This form has expired or is no longer available.",
              )
            }
          }
          throw e
        }
      } else {
        setLatestRecordId(record.response.state)
        queryClient.setQueryData(
          [
            "self-service",
            "events",
            eventId,
            "carts",
            cartId,
            "interview",
            { interviewId, registrationId, stateId: record.response.state },
          ],
          record,
        )
        navigate({
          hash: `s=${record.response.state}`,
        })
      }
    },
    [navigate, interviewId, registrationId, cartId, eventId],
  )

  const getHistoryLink = useCallback(
    (state: string) => {
      const loc = router.buildLocation({
        to: addRegistrationRoute.to,
        params: { eventId, interviewId },
        hash: `s=${state}`,
      })
      return loc.href
    },
    [router, eventId, cartId, interviewId],
  )

  if (!interviewRecord) {
    return <Skeleton h={300} />
  }

  return (
    <Interview
      api={interviewAPI}
      store={interviewStore}
      latestRecordId={latestRecordId ?? undefined}
      recordId={interviewRecord.response.state}
      onNavigate={onNavigate}
      onUpdate={onUpdate}
      onClose={onClose}
    >
      {(renderProps) => (
        <InterviewPanel getHistoryLink={getHistoryLink} {...renderProps} />
      )}
    </Interview>
  )
}

// const InterviewPage = ({
//   eventId,
//   interviewId,
//   registrationId,
//   recordFromRoute,
// }: {
//   eventId: string
//   interviewId: string
//   registrationId?: string
//   recordFromRoute?: InterviewResponseRecord
// }) => {
//   const loc = useLocation()

//   const [currentCart, setCurrentCart] = useCurrentCart(eventId)

//   // keep using this cart ID until unmounted
//   const curCartIdRef = useRef(currentCart.id)

//   // prevent starting a new interview after completion between navigate and rerender
//   const curStateRef = useRef<string | null>(null)

//   const cartId = curCartIdRef.current
//   const navigate = useNavigate()
//   const router = useRouter()
//   const appCtx = useApp()
//   const {selfServiceAPI: selfService} = appCtx
//   const queryClient = useQueryClient()

//   const locStateId = getStateId(loc.hash)
//   const accessCode = getAccessCode(loc.hash)
//   const [latestRecordId, setLatestRecordId] = useState<string | null>(null)

//   const [interviewAPI, interviewStore] = useInterviewAPI()

//   const cartQueries = getCartQueryOptions(appCtx)
//   const initialInterviewRecord = useQuery({
//     ...cartQueries.initialInterviewRecord(eventId, cartId, interviewId, registrationId, accessCode),
//     enabled: !recordFromRoute && !curStateRef.current && !locStateId,
//   })
//   const curInterviewRecord = useQuery({
//     ...cartQueries.interviewRecord(curStateRef.current || locStateId || ""),
//     enabled: !recordFromRoute && !!curStateRef.current || !!locStateId,
//   })
//   const interviewRecord = recordFromRoute || curInterviewRecord.data || initialInterviewRecord.data

//   useLayoutEffect(() => {
//     if (!curStateRef.current && !locStateId && interviewRecord) {
//       navigate({
//         hash: `s=${interviewRecord.response.state}`,
//         replace: true,
//       })
//     }
//   }, [recordFromRoute, curStateRef.current ?? locStateId, interviewRecord])

//   if (locStateId) {
//     curStateRef.current = locStateId
//   }

//   const onNavigate = useCallback(
//     (state: string) => {
//       navigate({
//         hash: `s=${state}`,
//       })
//     },
//     [navigate],
//   )
//   const onClose = useCallback(() => {
//     navigate({
//       to: registrationsRoute.to,
//       params: {
//         eventId: eventId,
//       },
//     })
//   }, [navigate, eventId])

//   const onUpdate = useCallback(
//     async (record: InterviewResponseRecord) => {
//       if (record.response.completed) {
//         try {
//           const res = await selfService.completeInterview(record.response.state)
//           curStateRef.current = record.response.state
//           navigate({
//             to: cartRoute.to,
//             params: {
//               eventId: eventId,
//             },
//           })
//           setCurrentCart(res)
//         } catch (e) {
//           if (isResponseError(e)) {
//             if (e.status == 409) {
//               throw new Error(
//                 "This registration has been changed and is out of date. " +
//                   "Please start over to work with the latest version.",
//               )
//             } else if (e.status == 404) {
//               throw new Error(
//                 "This form has expired or is no longer available.",
//               )
//             }
//           }
//           throw e
//         }
//       } else {
//         setLatestRecordId(record.response.state)
//         queryClient.setQueryData(
//           [
//             "self-service",
//             "events",
//             eventId,
//             "carts",
//             cartId,
//             "interview",
//             { interviewId, registrationId, stateId: record.response.state },
//           ],
//           record,
//         )
//         navigate({
//           hash: `s=${record.response.state}`,
//         })
//       }
//     },
//     [navigate, interviewId, registrationId, cartId, eventId],
//   )

//   const getHistoryLink = useCallback(
//     (state: string) => {
//       const loc = router.buildLocation({
//         to: addRegistrationRoute.to,
//         params: { eventId, interviewId },
//         hash: `s=${state}`,
//       })
//       return loc.href
//     },
//     [router, eventId, cartId, interviewId],
//   )

//   if (!interviewRecord) {
//     return <Skeleton h={300} />
//   }

//   return (
//     <Interview
//       api={interviewAPI}
//       store={interviewStore}
//       latestRecordId={latestRecordId ?? undefined}
//       recordId={interviewRecord.response.state}
//       onNavigate={onNavigate}
//       onUpdate={onUpdate}
//       onClose={onClose}
//     >
//       {(renderProps) => (
//         <InterviewPanel getHistoryLink={getHistoryLink} {...renderProps} />
//       )}
//     </Interview>
//   )
// }

const getStateId = (hash: string) => {
  if (!hash) {
    return null
  }
  const params = new URLSearchParams(hash)
  return params.get("s")
}

const getAccessCode = (hash: string) => {
  if (!hash) {
    return null
  }
  const params = new URLSearchParams(hash)
  return params.get("a")
}
