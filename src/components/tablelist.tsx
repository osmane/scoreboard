import { useEffect, useState } from "react"
import { Table } from "@/interfaces"
import { TableItem } from "./table"
import { PlayModal } from "./PlayModal"

export function TableList({
  userId,
  userName, // Add userName
  onJoin,
  onSpectate,
  refresh,
}: {
  userId: string
  userName: string // Add userName type
  onJoin: (tableId: string) => Promise<boolean>
  onSpectate: (tableId: string) => void
  refresh: boolean
}) {
  const [tables, setTables] = useState<Table[]>([])
  const [modalTableId, setModalTableId] = useState<string | null>(null)

  const fetchTables = async () => {
    const res = await fetch("/api/tables")
    const data = await res.json()
    setTables(data)
  }

  const handleJoin = async (tableId: string) => {
    const success = await onJoin(tableId)
    if (success) {
      setModalTableId(tableId)
    }
  }

  useEffect(() => {
    fetchTables()
    const interval = setInterval(fetchTables, 15000)
    return () => clearInterval(interval)
  }, [refresh]) // Add refresh to dependencies

  useEffect(() => {
    tables.forEach((table) => {
      if (table.creator.id === userId && table.players.length === 2) {
        setModalTableId(table.id)
      }
    })
  }, [tables, userId])

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => (
          <TableItem
            key={table.id}
            table={table}
            onJoin={handleJoin}
            onSpectate={onSpectate}
            userId={userId}
          />
        ))}
      </div>
      <PlayModal
        isOpen={!!modalTableId}
        onClose={() => setModalTableId(null)}
        tableId={modalTableId || ""}
        userName={userName} // Pass userName
        userId={userId} // Pass userId
      />
    </div>
  )
}
