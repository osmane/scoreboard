import { useEffect, useState } from "react"
import { Table } from "@/services/interfaces"
import { TableItem } from "./table"
import { PlayModal } from "./PlayModal"

export function TableList({
  userId,
  userName,
  onJoin,
  onSpectate,
  tables,
}: {
  userId: string
  userName: string
  onJoin: (tableId: string) => Promise<boolean>
  onSpectate: (tableId: string) => void
  tables: Table[]
}) {
  const [modalTable, setModalTable] = useState<{
    id: string
    ruleType: string
  } | null>(null)

  const handleJoin = async (tableId: string) => {
    const success = await onJoin(tableId)
    if (success) {
      const table = tables.find((t) => t.id === tableId)
      setModalTable(table ? { id: table.id, ruleType: table.ruleType } : null)
    }
  }

  useEffect(() => {
    tables.forEach((table) => {
      if (table.creator.id === userId && table.players.length === 2) {
        setModalTable({ id: table.id, ruleType: table.ruleType })
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
        isOpen={!!modalTable}
        onClose={() => setModalTable(null)}
        tableId={modalTable?.id || ""}
        userName={userName}
        userId={userId}
        ruleType={modalTable?.ruleType || "nineball"}
      />
    </div>
  )
}
