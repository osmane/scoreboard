// src/components/TableList.tsx
import { useEffect, useState } from 'react'
import { Table } from '@/interfaces'

export function TableList({ userId, onJoin, onSpectate, refresh }: {
  userId: string
  onJoin: (tableId: string) => void
  onSpectate: (tableId: string) => void
  refresh: boolean
}) {
  const [tables, setTables] = useState<Table[]>([])

  useEffect(() => {
    const fetchTables = async () => {
      const res = await fetch('/api/tables')
      const data = await res.json()
      setTables(data)
    }

    fetchTables()
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchTables, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (refresh) {
      const fetchTables = async () => {
        const res = await fetch('/api/tables')
        const data = await res.json()
        setTables(data)
      }
      fetchTables()
    }
  }, [refresh])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Active Tables</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {tables.map(table => (
          <div key={table.id} className="p-4 border rounded-lg bg-green-800 text-white">
            <div className="flex justify-between">
              <div>
                <p>Created by: {table.creator.name}</p>
                <p>Players: {table.players.length}/2</p>
                <p>Spectators: {table.spectators.length}</p>
              </div>
              <div className="space-x-2">
                {table.players.length < 2 && (
                  <button
                    onClick={() => onJoin(table.id)}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Join
                  </button>
                )}
                <button
                  onClick={() => onSpectate(table.id)}
                  className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Spectate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}