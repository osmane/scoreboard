import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { TableList } from '@/components/tablelist'
import { CreateTable } from '@/components/createtable'

export default function Lobby() {
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || uuidv4()
    const storedUserName = localStorage.getItem('userName') || 'Anonymous'
    setUserId(storedUserId)
    setUserName(storedUserName)
    localStorage.setItem('userId', storedUserId)
    localStorage.setItem('userName', storedUserName)
  }, [])

  const handleJoin = async (tableId: string) => {
    await fetch(`/api/tables/${tableId}/join`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName })
    })
  }

  const handleSpectate = async (tableId: string) => {
    await fetch(`/api/tables/${tableId}/spectate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName })
    })
  }

  const handleCreate = () => {
    setRefresh(prev => !prev)
  }

  return (
    <main className="container p-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Game Lobby</h1>
      <div className="mb-8">
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
