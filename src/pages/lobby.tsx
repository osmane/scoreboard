import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { TableList } from "@/components/tablelist"
import { CreateTable } from "@/components/createtable"
import { ServerStatus } from "@/components/ServerStatus"
import { User } from "@/components/User"

export default function Lobby() {
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [refresh, setRefresh] = useState(false)
  const searchParams = useSearchParams()
  const statusPage = "https://billiards.onrender.com"

  useEffect(() => {
    const storedUserId = crypto.randomUUID().slice(0, 8)
    const urlUserName = searchParams.get("username")
    const storedUserName =
      urlUserName || localStorage.getItem("userName") || "Anonymous"

    setUserId(storedUserId)
    setUserName(storedUserName)
    localStorage.setItem("userId", storedUserId)
    localStorage.setItem("userName", storedUserName)
  }, [searchParams])

  const handleJoin = async (tableId: string) => {
    const response = await fetch(`/api/tables/${tableId}/join`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userName }),
    })
    setRefresh((prev) => !prev)
    return response.status === 200
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

  const handleUserNameChange = (newUserName: string) => {
    setUserName(newUserName)
    localStorage.setItem("userName", newUserName)
  }

  return (
    <main className="container p-2 mx-auto">
      <div className="flex items-stretch justify-between gap-1 mb-1 h-8">
        <div className="flex items-stretch gap-1">
          <ServerStatus statusPage={statusPage} />
          <CreateTable
            userId={userId}
            userName={userName}
            onCreate={handleCreate}
          />
        </div>
        <User
          userName={userName}
          userId={userId}
          onUserNameChange={handleUserNameChange}
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
