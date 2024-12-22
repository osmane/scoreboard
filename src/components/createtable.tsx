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
      className="px-2 py-1 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 disabled:opacity-50"
    >
      {isLoading ? "Creating..." : "Create New Table"}
    </button>
  )
}
