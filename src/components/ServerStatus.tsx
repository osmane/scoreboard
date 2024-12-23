import { useEffect, useState } from "react"

interface ServerStatusProps {
  statusPage: string
}

export function ServerStatus({ statusPage }: ServerStatusProps) {
  const [serverStatus, setServerStatus] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [progress, setProgress] = useState(0)

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

  // Progress bar animation effect
  useEffect(() => {
    let animationFrame: number
    let startTime: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const duration = 30000 // 30 seconds

      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (elapsed < duration && !isOnline) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    if (!isOnline) {
      setProgress(0)
      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isOnline])

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded ${
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
      {!isOnline && (
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

export default ServerStatus