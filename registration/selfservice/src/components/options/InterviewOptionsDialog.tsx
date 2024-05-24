import { OptionsDialog } from "@open-event-systems/registration-common/components"
import { addRegistrationRoute, eventRoute } from "../../routes/index.js"
import { useNavigate } from "@tanstack/react-router"
import { useInterviewOptionsDialog } from "../../hooks/interview.js"

export const InterviewOptionsDialog = () => {
  const { eventId } = eventRoute.useParams()
  const interviewOptions = useInterviewOptionsDialog()
  const navigate = useNavigate()

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
            eventId: eventId,
            interviewId: opt,
          },
        })
      }}
    />
  )
}
