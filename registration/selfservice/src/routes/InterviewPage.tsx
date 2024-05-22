import { Title } from "@open-event-systems/registration-common/components"
import { useEvent } from "../hooks/api.js"
import { addRegistrationRoute, registrationsRoute } from "./index.js"
import { useCartPricingResult, useCartInterviewRecord } from "../hooks/cart.js"
import { useCallback, useState } from "react"
import { useLocation, useRouter } from "@tanstack/react-router"
import { InterviewResponseRecord } from "@open-event-systems/interview-lib"
import {
  Interview,
  InterviewPanel,
  useInterviewAPI,
} from "@open-event-systems/interview-components"

export const InterviewPage = () => {
  const { eventId, cartId, interviewId } = addRegistrationRoute.useParams()
  const event = useEvent(eventId)
  const cart = useCartPricingResult(cartId)
  const loc = useLocation()
  const navigate = addRegistrationRoute.useNavigate()
  const router = useRouter()

  const locStateId = getStateId(loc.hash)
  const [latestRecordId, setLatestRecordId] = useState<string | null>(null)

  const [interviewAPI, interviewStore] = useInterviewAPI()

  const interviewRecord = useCartInterviewRecord(
    eventId,
    cartId,
    interviewId,
    "http://localhost:8000/update-interview", // TODO
    locStateId,
  )

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
