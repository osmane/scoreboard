import { useEffect, useState } from "react"

interface ServerStatusProps {
  statusPage: string
}

export function ServerStatus({ statusPage }: ServerStatusProps) {
  const [serverStatus, setServerStatus] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showLogs, setShowLogs] = useState(false)

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
    <div className="relative">
      <div
        className={`inline-flex items-center gap-1 text-xs px-2 py-2 rounded ${
          serverStatus === null
            ? "bg-gray-200"
            : isOnline
              ? "bg-green-200"
              : "bg-red-200"
        }`}
        onClick={() => setShowLogs(true)}
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
      {showLogs && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 flex items-center justify-center">
          <div className="relative w-3/4 h-3/4 bg-white shadow-lg">
            <button
              className="absolute top-2 right-2 text-black-500 text-xl"
              onClick={() => setShowLogs(false)}
            >
              ✖
            </button>
            <iframe
              src="https://billiards.onrender.com/logs"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ServerStatus
