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
          mode: "no-cors"
        }
        const response = await fetch(statusPage, fetchOptions)
        if (response?.type === "opaque" || response?.ok) {
          setServerStatus("Server OK")
          setIsOnline(true)
        } else {
          setServerStatus(`Server Issue: ${response.status} ${response.statusText}`)
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
    <div className="flex items-center gap-1 text-sm">
      <span className={`${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
        💻
      </span>
      <span className="text-gray-500">{serverStatus}</span>
    </div>
  )
}
