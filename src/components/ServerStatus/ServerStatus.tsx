import { FC, useState } from "react"
import { StatusIndicator } from "./StatusIndicator"
import { LogsModal } from "./LogsModal"
import { useServerStatus } from "../hooks/useServerStatus"

interface ServerStatusProps {
  readonly statusPage: string
}

export const ServerStatus: FC<ServerStatusProps> = ({ statusPage }) => {
  const [showLogs, setShowLogs] = useState(false)
  const serverState = useServerStatus(statusPage)

  return (
    <div className="relative">
      <StatusIndicator {...serverState} onClick={() => setShowLogs(true)} />
      <LogsModal showLogs={showLogs} onClose={() => setShowLogs(false)} />
    </div>
  )
}
