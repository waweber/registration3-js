import { Button, Group, Modal, ModalProps, useProps } from "@mantine/core"
import clsx from "clsx"

export type AlertDialogProps = Omit<ModalProps, "children"> & {
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export const AlertDialog = (props: AlertDialogProps) => {
  const {
    className,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    ...other
  } = useProps("AlertDialog", {}, props)

  return (
    <Modal className={clsx("AlertDialog-root", className)} centered {...other}>
      {message}
      <Group mt="sm" justify="space-between">
        {onConfirm && (
          <Button onClick={() => onConfirm()}>{confirmText}</Button>
        )}
        {onCancel && (
          <Button variant="outline" onClick={() => onCancel()}>
            {cancelText}
          </Button>
        )}
      </Group>
    </Modal>
  )
}
