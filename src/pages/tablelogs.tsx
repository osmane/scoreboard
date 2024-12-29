import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { NchanSub } from "@/nchan/nchansub"

export default function TableLogs() {
  const router = useRouter()
  const { tableId } = router.query
  const [messages, setMessages] = useState<string[]>([])
  const [subscription, setSubscription] = useState<NchanSub | null>(null)

  useEffect(() => {
    if (!tableId) return

    const sub = new NchanSub(
      tableId as string,
      (message) => {
        const messageString = message.toString()
        setMessages((prev) => [...prev, messageString])
      },
      "table"
    )

    sub.start()
    setSubscription(sub)

    return () => {
      if (sub) {
        sub.stop()
      }
    }
  }, [tableId])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Logs for Table {tableId}</h1>
      </div>
      <div className="border rounded bg-gray-50 p-4">
        <pre className="font-mono text-[10px] leading-tight whitespace-pre-wrap max-h-[80vh] overflow-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className="py-1 min-h-[2rem] border-b border-gray-100 last:border-b-0"
            >
              {message}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
