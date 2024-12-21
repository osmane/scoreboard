import { useEffect, useState } from "react"

interface ServerStatusProps {
  statusPage: string
}

export function ServerStatus({ statusPage }: ServerStatusProps) {
  const [serverStatus, setServerStatus] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const checkServerStatus = async () => {
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
      }
    }

    checkServerStatus()
    const intervalId = setInterval(checkServerStatus, 60000)
    return () => clearInterval(intervalId)
  }, [statusPage])

  return (
    <div
      className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md ${
        serverStatus === null
          ? "bg-gray-200"
          : isOnline
            ? "bg-green-200"
            : "bg-red-200"
      }`}
    >
      <span className={`${isOnline ? "text-green-500" : "text-gray-400"}`}>
        💻
      </span>
      {!isOnline && <span className="text-gray-500">{serverStatus}</span>}
    </div>
  )
}
