import { kv } from "@vercel/kv"
import { Table, Player } from "@/interfaces"
import { v4 as uuidv4 } from "uuid"

const TABLES_KEY = "tables"
const TABLE_TIMEOUT = 60 * 1000 // 1 minute

class TableService {
  async getTables() {
    const tables = await kv.hgetall<Record<string, Table>>(TABLES_KEY)
    return Object.values(tables || {}).filter((table) => {
      return table.isActive && Date.now() - table.lastUsedAt <= TABLE_TIMEOUT
    })
  }

  async createTable(userId: string, userName: string) {
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

  async joinTable(tableId: string, userId: string, userName: string) {
    const table = await kv.hget<Table>(TABLES_KEY, tableId)

    if (!table) {
      throw new Error("Table not found")
    }

    if (table.players.length >= 2) {
      throw new Error("Table is full")
    }

    const player: Player = { id: userId, name: userName || "Anonymous" }
    table.players.push(player)
    table.lastUsedAt = Date.now()

    await kv.hset(TABLES_KEY, { [tableId]: table })
    return table
  }

  async spectateTable(tableId: string, userId: string, userName: string) {
    const table = await kv.hget<Table>(TABLES_KEY, tableId)

    if (!table) {
      throw new Error("Table not found")
    }

    const spectator: Player = { id: userId, name: userName || "Anonymous" }
    table.spectators.push(spectator)
    table.lastUsedAt = Date.now()

    await kv.hset(TABLES_KEY, { [tableId]: table })
    return table
  }
}

export default TableService
