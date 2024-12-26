import { NextRequest } from "next/server"
import { kv } from "@vercel/kv"
import { Table } from "@/services/table"

const TABLES_KEY = "tables"

export async function GET(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  try {
    const table = await kv.hget<Table>(TABLES_KEY, params.tableId)
    if (!table) {
      return Response.json({ error: "Table not found" }, { status: 404 })
    }
    return Response.json(table)
  } catch (error) {
    return Response.json({ error: "Failed to fetch table" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tableId: string } }
) {
  try {
    const { userId } = await request.json()
    const table: Table = await kv.hget<Table>(TABLES_KEY, params.tableId)

    if (!table) {
      return Response.json({ error: "Table not found" }, { status: 404 })
    }

    if (table.creator.id !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    await kv.hdel(TABLES_KEY, params.tableId)
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to delete table" }, { status: 500 })
  }
}
