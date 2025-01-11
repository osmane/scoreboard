import { useEffect, useState, useCallback } from "react"
import { NchanPub } from "../nchan/nchanpub"
import {
  ArrowPathIcon,
  ComputerDesktopIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"
import LogsModal from "./LogsModal"

interface ServerStatusProps {
  readonly statusPage: string
}

const statusColors = {
  connecting: "bg-yellow-200",
  online: "bg-green-200",
  offline: "bg-red-200",
}

let textConnect = "Connecting..."

const ConnectingStatus: React.FC = () => (
  <span className="flex items-center">
    <ArrowPathIcon className="status-icon status-icon-connecting" />
    <span className="status-text">{textConnect}</span>
  </span>
)

const OnlineStatus: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <ComputerDesktopIcon
    className={`status-icon ${isOnline ? "status-icon-online" : "status-icon-offline"}`}
  />
)

const UserCount: React.FC<{ activeUsers: number | null }> = ({
  activeUsers,
}) => {
  if (activeUsers === null) {
    return null
  }

  textConnect = ""

  return (
    <>
      <span className="status-text">{activeUsers}</span>
      <UsersIcon className="status-icon status-text" />
    </>
  )
}

const ServerStatusText: React.FC<{
  serverStatus: string | null
  isOnline: boolean
  isConnecting: boolean
}> = ({ serverStatus, isOnline, isConnecting }) => {
  if (isOnline || isConnecting) {
    return null
  }
  return <span className="status-text">{serverStatus}</span>
}

interface StatusIndicatorProps {
  isConnecting: boolean
  isOnline: boolean
  activeUsers: number | null
  serverStatus: string | null
  onClick: () => void
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isConnecting,
  isOnline,
  activeUsers,
  serverStatus,
  onClick,
}) => {
  const statusClass = isConnecting 
    ? "status-connecting" 
    : isOnline 
      ? "status-online" 
      : "status-offline"

  return (
    <button
      className={`status-indicator ${statusClass}`}
      onClick={onClick}
    >
      {isConnecting ? (
        <ConnectingStatus />
      ) : (
        <OnlineStatus isOnline={isOnline} />
      )}
      <UserCount activeUsers={activeUsers} />
      <ServerStatusText
        serverStatus={serverStatus}
        isOnline={isOnline}
        isConnecting={isConnecting}
      />
    </button>
  )
}

export function ServerStatus({ statusPage }: ServerStatusProps) {
  const [serverStatus, setServerStatus] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [activeUsers, setActiveUsers] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)

  const checkServerStatus = useCallback(async () => {
    setIsConnecting(true)
    try {
      const fetchOptions: RequestInit = {
        method: "GET",
        cache: "no-store",
      }
      const response = await fetch(statusPage, fetchOptions)
      if (response?.type === "opaque" || response?.ok) {
        setServerStatus("Server OK")
        setIsOnline(true)
      } else {
        setServerStatus(
          `Server Issue: ${response.status} ${response.statusText}`
        )
        setIsOnline(false)
      }
    } catch (error: any) {
      setServerStatus(`Server Down: ${error.message}`)
      setIsOnline(false)
    } finally {
      setIsConnecting(false)
    }

    try {
      const users = await new NchanPub("lobby").get()
      setActiveUsers(users)
    } catch (error: any) {
      setActiveUsers(null)
    }
  }, [statusPage])

  useEffect(() => {
    checkServerStatus()
    const intervalId = setInterval(checkServerStatus, 60000)
    return () => clearInterval(intervalId)
  }, [checkServerStatus])

  const handleShowLogs = () => {
    setShowLogs(true)
  }

  const handleCloseLogs = () => {
    setShowLogs(false)
  }

  return (
    <div className="relative">
      <StatusIndicator
        isConnecting={isConnecting}
        isOnline={isOnline}
        activeUsers={activeUsers}
        serverStatus={serverStatus}
        onClick={handleShowLogs}
      />
      <LogsModal showLogs={showLogs} onClose={handleCloseLogs} />
    </div>
  )
}

export default ServerStatus
