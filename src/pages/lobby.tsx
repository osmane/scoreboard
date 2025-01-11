import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { TableList } from "@/components/tablelist"
import { CreateTable } from "@/components/createtable"
import { ServerStatus } from "@/components/ServerStatus/ServerStatus"
import { User } from "@/components/User"
import Head from "next/head"
import { Table } from "@/services/table"
import { NchanSub } from "@/nchan/nchansub"
import { Title } from "@/components/Title"
import { markUsage } from "@/utils/usage"

export default function Lobby() {
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [tables, setTables] = useState<Table[]>([])
  const searchParams = useSearchParams()
  const statusPage = "https://billiards-network.onrender.com/basic_status"

  const fetchTables = async () => {
    const res = await fetch("/api/tables")
    const data = await res.json()
    setTables(data)
  }

  useEffect(() => {
    markUsage("lobby")
    const storedUserId = crypto.randomUUID().slice(0, 8)
    const urlUserName = searchParams.get("username")
    const storedUserName =
      urlUserName || localStorage.getItem("userName") || "Anonymous"

    setUserId(storedUserId)
    setUserName(storedUserName)
    localStorage.setItem("userId", storedUserId)
    localStorage.setItem("userName", storedUserName)

    fetchTables()
    const client = new NchanSub("lobby", (e) => {
      fetchTables()
    })
    client.start()
    return () => client.stop()
  }, [searchParams])

  const handleJoin = async (tableId: string) => {
    const response = await fetch(`/api/tables/${tableId}/join`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userName }),
    })
    fetchTables()
    return response.status === 200
  }

  const handleSpectate = async (tableId: string) => {
    await fetch(`/api/tables/${tableId}/spectate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userName }),
    })
    fetchTables()
  }

  const handleCreate = () => {
    fetchTables()
  }

  const handleUserNameChange = (newUserName: string) => {
    setUserName(newUserName)
    localStorage.setItem("userName", newUserName)
  }

  return (
    <main className="container p-2 mx-auto">
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex items-stretch justify-between gap-1 mb-1 h-8">
        <div className="flex items-stretch gap-1">
          <CreateTable
            userId={userId}
            userName={userName}
            onCreate={handleCreate}
          />
        </div>
        <div className="flex items-stretch gap-1">
          <User
            userName={userName}
            userId={userId}
            onUserNameChange={handleUserNameChange}
          />
          <Title />
          <ServerStatus statusPage={statusPage} />
        </div>
      </div>
      <TableList
        userId={userId}
        userName={userName}
        onJoin={handleJoin}
        onSpectate={handleSpectate}
        tables={tables}
      />
    </main>
  )
}
