import { useEffect, useState } from "react"
import { Table } from "@/services/table"
import { TableItem } from "./table"
import { PlayModal } from "./PlayModal"

export function TableList({
  userId,
  userName,
  onJoin,
  onSpectate,
  tables,
}: {
  readonly userId: string
  readonly userName: string
  readonly onJoin: (tableId: string) => Promise<boolean>
  readonly onSpectate: (tableId: string) => void
  readonly tables: Table[]
}) {
  const [modalTable, setModalTable] = useState<{
    id: string
    ruleType: string
  } | null>(null)

  const handleJoin = async (tableId: string) => {
    const success = await onJoin(tableId)
    if (success) {
      const table = tables.find((t) => t.id === tableId)
      if (table && !table.completed) {
        setModalTable({ id: table.id, ruleType: table.ruleType })
      }
    }
  }

  useEffect(() => {
    tables.forEach((table) => {
      if (
        table.creator.id === userId &&
        table.players.length === 2 &&
        !table.completed
      ) {
        setModalTable({ id: table.id, ruleType: table.ruleType })
      }
    })
  }, [tables, userId])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {tables.map((table) => (
          <div
            key={table.id}
            className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/8"
          >
            {" "}
            {/* Adjust widths as needed */}
            <TableItem
              table={table}
              onJoin={handleJoin}
              onSpectate={onSpectate}
              userId={userId}
            />
          </div>
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
