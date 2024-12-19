import { NextRequest } from "next/server"
import { kv } from "@vercel/kv"
import { Table, Player } from "@/interfaces"

const TABLES_KEY = "tables"

export async function PUT(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  try {
    const { userId, userName } = await request.json()
    const table = await kv.hget<Table>(TABLES_KEY, params.tableId)

    if (!table) {
      return Response.json({ error: "Table not found" }, { status: 404 })
    }

    const spectator: Player = { id: userId, name: userName || "Anonymous" }
    table.spectators.push(spectator)
    table.lastUsedAt = Date.now()

    await kv.hset(TABLES_KEY, { [params.tableId]: table })
    return Response.json(table)
  } catch (error) {
    return Response.json({ error: "Failed to spectate table" }, { status: 500 })
  }
}
