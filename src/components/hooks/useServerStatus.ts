import { useState, useCallback, useEffect } from "react"
import { NchanPub } from "../../nchan/nchanpub"

export interface ServerStatusState {
  serverStatus: string | null
  isOnline: boolean
  isConnecting: boolean
  activeUsers: number | null
}

export function useServerStatus(statusPage: string) {
  const [state, setState] = useState<ServerStatusState>({
    serverStatus: null,
    isOnline: false,
    isConnecting: true,
    activeUsers: null,
  })

  const checkServerStatus = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true }))

    try {
      const response = await fetch(statusPage, {
        method: "GET",
        cache: "no-store",
      })

      if (response?.type === "opaque" || response?.ok) {
        setState((prev) => ({
          ...prev,
          serverStatus: "Server OK",
          isOnline: true,
        }))
        registerConnected()
      } else {
        setState((prev) => ({
          ...prev,
          serverStatus: `Server Issue: ${response.status} ${response.statusText}`,
          isOnline: false,
        }))
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        serverStatus: `Server Down: ${error.message}`,
        isOnline: false,
      }))
    } finally {
      setState((prev) => ({ ...prev, isConnecting: false }))
    }

    try {
      const users = await new NchanPub("lobby").get()
      setState((prev) => ({ ...prev, activeUsers: users }))
    } catch {
      setState((prev) => ({ ...prev, activeUsers: null }))
    }
  }, [statusPage])

  useEffect(() => {
    checkServerStatus()
    const intervalId = setInterval(checkServerStatus, 60000)
    return () => clearInterval(intervalId)
  }, [checkServerStatus])

  return state
}

async function registerConnected() {
  fetch("/api/connected", {
    method: "GET",
  })
}