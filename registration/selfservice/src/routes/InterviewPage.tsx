import { Title } from "@open-event-systems/registration-common/components"
import { useEvent } from "../hooks/api.js"
import { addRegistrationRoute, registrationsRoute } from "./index.js"
import { useCart, useCartInterview } from "../hooks/cart.js"
import { useInterviewAPI } from "../hooks/interview.js"
import { useCallback, useState } from "react"
import { useLocation, useRouter } from "@tanstack/react-router"
import { InterviewResponseRecord } from "@open-event-systems/interview-lib"
import {
  Interview,
  InterviewPanel,
} from "@open-event-systems/interview-components"

export const InterviewPage = () => {
  const { eventId, cartId, interviewId } = addRegistrationRoute.useParams()
  const event = useEvent(eventId)
  const cart = useCart(cartId)
  const loc = useLocation()
  const navigate = addRegistrationRoute.useNavigate()
  const router = useRouter()

  const locStateId = getStateId(loc.hash)
  const [interviewAPI, interviewStore] = useInterviewAPI()
  const [latestRecordId, setLatestRecordId] = useState<string | null>(null)

  const initialState = useCartInterview(
    eventId,
    cartId,
    interviewId,
    locStateId ?? undefined,
  )

  const stateId = locStateId ?? initialState?.state

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
  }, [navigate])

  const onUpdate = useCallback(
    (record: InterviewResponseRecord) => {
      if (record.response.completed) {
        console.log("completed")
      } else {
        setLatestRecordId(record.response.state)
        navigate({
          hash: `s=${record.response.state}`,
        })
      }
    },
    [navigate],
  )

  const getHistoryLink = useCallback(
    (state: string) => {
      const loc = router.buildLocation({
        to: addRegistrationRoute.to,
        params: { eventId, cartId, interviewId },
        hash: `s=${state}`,
      })
      return loc.href
    },
    [router],
  )

  return (
    <Title title="Add registration">
      <Interview
        api={interviewAPI}
        store={interviewStore}
        latestRecordId={latestRecordId ?? undefined}
        recordId={stateId}
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
