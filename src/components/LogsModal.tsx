import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Table } from "@/services/table"

interface LogsModalProps {
  showLogs: boolean
  onClose: () => void
}

const LogsModal: React.FC<LogsModalProps> = ({ showLogs, onClose }) => {
  const [tables, setTables] = useState<Table[]>([])

  const fetchTables = async () => {
    try {
      const res = await fetch("/api/tables")
      const data = await res.json()
      setTables(data)
    } catch (error) {
      console.error("Error fetching tables:", error)
    }
  }

  const handleTableClick = (tableId: string) => {
    window.open(`/tablelogs?tableId=${tableId}`, "_blank")
  }

  useEffect(() => {
    if (showLogs) {
      fetchTables()
    }
  }, [showLogs])

  if (!showLogs) return null

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 flex items-center justify-center">
      <div className="relative w-3/4 h-3/4 bg-white shadow-lg">
        <button
          className="absolute top-2 right-2 text-black-500 text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="p-4 h-full overflow-auto">
          {tables.map((table) => (
            <div key={table.id} className="border rounded mb-1">
              <div
                className="p-1 cursor-pointer hover:bg-gray-100 flex items-center"
                onClick={() => handleTableClick(table.id)}
              >
                <div>
                  Table ID: {table.id} Creator: {table.creator.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LogsModal
