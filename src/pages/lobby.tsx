import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { TableList } from "@/components/tablelist"
import { CreateTable } from "@/components/createtable"

export default function Lobby() {
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [refresh, setRefresh] = useState(false)
  const [serverStatus, setServerStatus] = useState<string | null>(null)
  const statusPage = "https://billiards.onrender.com"

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || uuidv4()
    const storedUserName = localStorage.getItem("userName") || "Anonymous"
    setUserId(storedUserId)
    setUserName(storedUserName)
    localStorage.setItem("userId", storedUserId)
    localStorage.setItem("userName", storedUserName)
  }, [])

  // Modern approach to check server status
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
          setServerStatus(`Server OK`)
        } else {
          setServerStatus(
            `Server Issue: ${response.status} ${response.statusText}`
          )
        }
      } catch (error: any) {
        setServerStatus(`Server Down: ${error.message}`)
      }
    }

    checkServerStatus() // Initial check

    const intervalId = setInterval(checkServerStatus, 60000) // Check every 60 seconds (adjust as needed)

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [statusPage])

  const handleJoin = async (tableId: string) => {
    await fetch(`/api/tables/${tableId}/join`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userName }),
    })
    setRefresh((prev) => !prev)
  }

  const handleSpectate = async (tableId: string) => {
    await fetch(`/api/tables/${tableId}/spectate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userName }),
    })
    setRefresh((prev) => !prev)
  }

  const handleCreate = () => {
    setRefresh((prev) => !prev)
  }

  return (
    <main className="container p-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Game Lobby</h1>
      {serverStatus && (
        <div className="text-sm text-gray-500 mb-4">Status: {serverStatus}</div>
      )}
      <div className="mb-8">
        <CreateTable
          userId={userId}
          userName={userName}
          onCreate={handleCreate}
        />
      </div>
      <TableList
        userId={userId}
        onJoin={handleJoin}
        onSpectate={handleSpectate}
        refresh={refresh}
      />
    </main>
  )
}
