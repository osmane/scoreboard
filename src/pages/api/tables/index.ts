import { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv"
import { Table, Player } from "@/interfaces"
import { v4 as uuidv4 } from "uuid"

const TABLES_KEY = "tables"
const TABLE_TIMEOUT = 60 * 1000 // 1 minute

async function getTables() {
  const tables = await kv.hgetall<Record<string, Table>>(TABLES_KEY)
  return Object.values(tables || {}).filter((table) => {
    return table.isActive && Date.now() - table.lastUsedAt <= TABLE_TIMEOUT
  })
}

async function createTable(userId: string, userName: string) {
  const tableId = uuidv4()
  const creator: Player = { id: userId, name: userName || "Anonymous" }

  const newTable: Table = {
    id: tableId,
    creator,
    players: [creator],
    spectators: [],
    createdAt: Date.now(),
    lastUsedAt: Date.now(),
    isActive: true,
  }

  await kv.hset(TABLES_KEY, { [tableId]: newTable })
  return newTable
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const tables = await getTables()
      res.status(200).json(tables)
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tables" })
    }
  } else if (req.method === "POST") {
    try {
      const { userId, userName } = req.body
      if (!userId) {
        res.status(400).json({ error: "User ID required" })
        return
      }

      const newTable = await createTable(userId, userName)
      res.status(201).json(newTable)
    } catch (error) {
      res.status(500).json({ error: "Failed to create table" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
