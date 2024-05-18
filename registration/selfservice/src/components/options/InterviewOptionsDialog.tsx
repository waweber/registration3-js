import { OptionsDialog } from "@open-event-systems/registration-common/components"
import { useRegistrations } from "../../hooks/api.js"
import { eventRoute } from "../../routes/index.js"
import { useLocation } from "@tanstack/react-router"
import { useInterviewOptionsDialog } from "../../hooks/interview.js"

export const InterviewOptionsDialog = () => {
  const interviewOptions = useInterviewOptionsDialog()

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
        // TODO: navigate to interview
      }}
    />
  )
}
