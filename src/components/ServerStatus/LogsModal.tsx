import { FC } from 'react'

interface LogsModalProps {
  showLogs: boolean
  onClose: () => void
}

export const LogsModal: FC<LogsModalProps> = ({ showLogs, onClose }) => {
  if (!showLogs) return null

  return (
    <div className="modal">
      {/* Your logs modal content */}
      <button onClick={onClose}>Close</button>
    </div>
  )
}
