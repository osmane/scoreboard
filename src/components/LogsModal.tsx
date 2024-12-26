import React from "react"

interface LogsModalProps {
  showLogs: boolean
  onClose: () => void
}

const LogsModal: React.FC<LogsModalProps> = ({ showLogs, onClose }) => {
  if (!showLogs) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 flex items-center justify-center">
      <div className="relative w-3/4 h-3/4 bg-white shadow-lg">
        <button
          className="absolute top-2 right-2 text-black-500 text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        <iframe
          src="https://billiards.onrender.com/logs"
          className="w-full h-full"
          title="Server Logs"
        />
      </div>
    </div>
  )
}

export default LogsModal
