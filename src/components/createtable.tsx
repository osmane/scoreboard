// src/components/CreateTable.tsx
import { useState } from "react"

export function CreateTable({
  userId,
  userName,
  onCreate,
}: {
  userId: string
  userName: string
  onCreate: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName }),
      })
      onCreate()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleCreate}
      disabled={isLoading}
      className="px-6 py-3 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
    >
      {isLoading ? "Creating..." : "Create New Table"}
    </button>
  )
}
