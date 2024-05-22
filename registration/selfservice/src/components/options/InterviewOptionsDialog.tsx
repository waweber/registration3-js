import { OptionsDialog } from "@open-event-systems/registration-common/components"
import { useRegistrations } from "../../hooks/api.js"
import { addRegistrationRoute, eventRoute } from "../../routes/index.js"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useInterviewOptionsDialog } from "../../hooks/interview.js"
import { useCurrentCart } from "../../hooks/cart.js"

export const InterviewOptionsDialog = () => {
  const { eventId } = eventRoute.useParams()
  const interviewOptions = useInterviewOptionsDialog()
  const [cart] = useCurrentCart(eventId)
  const navigate = useNavigate()

  // TODO: URL to interview page...

  return (
    <OptionsDialog
      title="Add Registration"
      opened={interviewOptions.opened}
      onClose={interviewOptions.close}
      options={interviewOptions.options.map((opt) => ({
        id: opt.id,
        label: opt.title,
      }))}
      onSelect={(opt) => {
        navigate({
          to: addRegistrationRoute.to,
          params: {
            cartId: cart.id,
            eventId: eventId,
            interviewId: opt,
          },
        })
      }}
    />
  )
}
