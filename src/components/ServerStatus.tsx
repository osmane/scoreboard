import { useEffect, useState, useCallback } from "react"
import { NchanPub } from "../nchan/nchanpub"
import {
  UsersIcon,
  ComputerDesktopIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"
import LogsModal from "./LogsModal"

interface ServerStatusProps {
  readonly statusPage: string
}

// Helper function to determine the status indicator color
const getStatusIndicatorColor = (isConnecting: boolean, isOnline: boolean) => {
  if (isConnecting) return "bg-yellow-200"
  if (isOnline) return "bg-green-200"
  return "bg-red-200"
}

// Helper function to determine the status icon
const getStatusIcon = (isConnecting: boolean, isOnline: boolean) => {
  if (isConnecting) {
    return <ArrowPathIcon className="h-4 w-4 text-yellow-500 animate-spin" />
  }
  return (
    <ComputerDesktopIcon
      className={`${isOnline ? "text-green-500" : "text-gray-400"} h-4 w-4`}
    />
  )
}

interface StatusIndicatorProps {
  isConnecting: boolean
  isOnline: boolean
  activeUsers: number | null
  serverStatus: string | null
  progress: number
  onClick: () => void
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isConnecting,
  isOnline,
  activeUsers,
  serverStatus,
  progress,
  onClick,
}) => {
  const [firstConnection, setFirstConnection] = useState(true)

  useEffect(() => {
    if (isOnline) {
      setFirstConnection(false)
    }
  }, [isOnline])

  return (
    <div
      role="button"
      className={`inline-flex items-center gap-1 text-xs px-2 py-2 rounded ${getStatusIndicatorColor(
        isConnecting,
        isOnline
      )}`}
      onClick={onClick}
    >
      {getStatusIcon(isConnecting, isOnline)}
      {!isConnecting && activeUsers !== null && (
        <>
          <span className="text-gray-500">{activeUsers}</span>
          <UsersIcon className="text-gray-500 h-4 w-4" />
        </>
      )}
      {isConnecting && firstConnection && (
        <span className="text-gray-500">Connecting...</span>
      )}
      {!isOnline && !isConnecting && (
        <>
          <span className="text-gray-500">{serverStatus}</span>
          <div className="w-24 h-1 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-gray-400 transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export function ServerStatus({ statusPage }: ServerStatusProps) {
  const [serverStatus, setServerStatus] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [progress, setProgress] = useState(0)
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
        progress={progress}
        onClick={handleShowLogs}
      />
      <LogsModal showLogs={showLogs} onClose={handleCloseLogs} />
    </div>
  )
}

export default ServerStatus
