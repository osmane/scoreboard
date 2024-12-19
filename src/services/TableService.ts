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
}

export default TableService
