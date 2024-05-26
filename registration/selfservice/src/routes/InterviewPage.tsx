import { Title } from "@open-event-systems/registration-common/components"
import { useEvent, useSelfServiceAPI } from "../hooks/api.js"
import {
  addRegistrationRoute,
  cartRoute,
  changeRegistrationRoute,
  registrationsRoute,
} from "./index.js"
import { useCartInterviewRecord, useCurrentCart } from "../hooks/cart.js"
import { Suspense, useCallback, useLayoutEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router"
import { InterviewResponseRecord } from "@open-event-systems/interview-lib"
import {
  Interview,
  InterviewPanel,
  useInterviewAPI,
} from "@open-event-systems/interview-components"
import { Skeleton } from "@mantine/core"

export const AddRegistrationPage = () => {
  const { eventId, interviewId } = addRegistrationRoute.useParams()

  return (
    <Suspense fallback={<Skeleton h={300} />}>
      <InterviewPage eventId={eventId} interviewId={interviewId} />
    </Suspense>
  )
}

export const ChangeRegistrationPage = () => {
  const { eventId, interviewId, registrationId } =
    changeRegistrationRoute.useParams()
  useEvent(eventId)

  return (
    <Suspense fallback={<Skeleton h={300} />}>
      <InterviewPage
        eventId={eventId}
        interviewId={interviewId}
        registrationId={registrationId}
      />
    </Suspense>
  )
}

const InterviewPage = ({
  eventId,
  interviewId,
  registrationId,
}: {
  eventId: string
  interviewId: string
  registrationId?: string
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
  const selfService = useSelfServiceAPI()

  const locStateId = getStateId(loc.hash)
  const [latestRecordId, setLatestRecordId] = useState<string | null>(null)

  const [interviewAPI, interviewStore] = useInterviewAPI()

  const interviewRecord = useCartInterviewRecord(
    eventId,
    cartId,
    interviewId,
    "http://localhost:8000/update-interview", // TODO
    registrationId,
    curStateRef.current ?? locStateId,
  )

  useLayoutEffect(() => {
    if (!curStateRef.current && !locStateId && interviewRecord) {
      navigate({
        hash: `s=${interviewRecord.response.state}`,
        replace: true,
      })
    }
  }, [curStateRef.current ?? locStateId, interviewRecord])

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
        const res = await selfService.completeInterview(record.response.state)
        curStateRef.current = record.response.state
        navigate({
          to: cartRoute.to,
          params: {
            eventId: eventId,
          },
        })
        setCurrentCart(res.id)
      } else {
        setLatestRecordId(record.response.state)
        navigate({
          hash: `s=${record.response.state}`,
        })
      }
    },
    [navigate, eventId],
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

  return (
    <Title title="Add registration">
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
    </Title>
  )
}

const getStateId = (hash: string) => {
  if (!hash) {
    return null
  }
  const params = new URLSearchParams(hash)
  return params.get("s")
}
