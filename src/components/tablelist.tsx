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
          <div key={table.id} className="relative p-6 rounded-xl shadow-md overflow-hidden bg-green-700 border-4 border-green-900">
            {/* Felt surface */}
            <div className="absolute inset-1 bg-green-500 rounded-lg shadow-inner"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-white font-semibold">Table #{table.id.split('-')[0]}</p>
                <p className="text-gray-200 text-sm">Created by: {table.creator.name}</p>
                <p className="text-gray-200 text-sm">Players: {table.players.length}/2</p>
                <p className="text-gray-200 text-sm">Spectators: {table.spectators.length}</p>
              </div>
              <div className="space-y-2">
                {table.players.length < 2 && (
                  <button
                    onClick={() => onJoin(table.id)}
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Join
                  </button>
                )}
                <button
                  onClick={() => onSpectate(table.id)}
                  className="w-full px-4 py-2 text-white bg-yellow-600 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  Spectate
                </button>
              </div>
            </div>
            {/* Corner pockets (optional visual enhancement) */}
            <div className="absolute top-0 left-0 w-4 h-4 bg-black rounded-full -mt-2 -ml-2 shadow-inner"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-black rounded-full -mt-2 -mr-2 shadow-inner"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-black rounded-full -mb-2 -ml-2 shadow-inner"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-black rounded-full -mb-2 -mr-2 shadow-inner"></div>
          </div>
        ))}
      </div>
    </div>
  )
}