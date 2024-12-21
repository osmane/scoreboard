// src/components/TableList.tsx
import { useEffect, useState } from "react"
import { Table } from "@/interfaces"
import { TableItem } from "./table" // Import the new TableItem component

export function TableList({
  userId,
  onJoin,
  onSpectate,
  refresh,
}: {
  userId: string
  onJoin: (tableId: string) => void
  onSpectate: (tableId: string) => void
  refresh: boolean
}) {
  const [tables, setTables] = useState<Table[]>([])

  const fetchTables = async () => {
    const res = await fetch("/api/tables")
    const data = await res.json()
    setTables(data)
  }

  useEffect(() => {
    fetchTables()
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchTables, 10000)
    return () => clearInterval(interval)
  }, [refresh]) // Add refresh to dependencies

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Active Tables</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => (
          <TableItem
            key={table.id}
            table={table}
            onJoin={onJoin}
            onSpectate={onSpectate}
          />
        ))}
      </div>
    </div>
  )
}
