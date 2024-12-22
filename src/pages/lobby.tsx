import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { TableList } from "@/components/tablelist"
import { CreateTable } from "@/components/createtable"
import { ServerStatus } from "@/components/ServerStatus"

export default function Lobby() {
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [refresh, setRefresh] = useState(false)
  const searchParams = useSearchParams()
  const statusPage = "https://billiards.onrender.com"

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || uuidv4()
    const urlUserName = searchParams.get("username")
    const storedUserName =
      urlUserName || localStorage.getItem("userName") || "Anonymous"

    setUserId(storedUserId)
    setUserName(storedUserName)
    localStorage.setItem("userId", storedUserId)
    localStorage.setItem("userName", storedUserName)
  }, [searchParams])

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
    <main className="container p-2 mx-auto">
      <div className="flex items-stretch gap-1 mb-1 h-8">
        <ServerStatus statusPage={statusPage} />
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
