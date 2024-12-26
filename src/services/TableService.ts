import { kv, VercelKV } from "@vercel/kv"
import { Table, Player } from "@/services/interfaces"
import { NchanPub } from "@/nchan/nchanpub"

const KEY = "tables"
const TABLE_TIMEOUT = 60 * 1000 // 1 minute

export class TableService {
  constructor(
    private readonly store: VercelKV = kv,
    private readonly notify: (event: any) => Promise<void> = this.defaultNotify
  ) {}

  async getTables() {
    await this.expireTables()
    const tables = await this.store.hgetall<Record<string, Table>>(KEY)
    return Object.values(tables || {}).sort((a, b) => b.createdAt - a.createdAt)
  }

  async expireTables() {
    const tables = await this.store.hgetall<Record<string, Table>>(KEY)
    const expiredEntries = Object.entries(tables || {}).filter(
      ([, table]) => Date.now() - table.lastUsedAt > TABLE_TIMEOUT
    )
    //delete these tables
    if (expiredEntries.length > 0) {
      // Use hdel to remove multiple fields from the hash
      const keysToDelete = expiredEntries.map(([key, _]) => key)
      await this.store.hdel(KEY, ...keysToDelete)

      console.log(`Expired and deleted ${expiredEntries.length} tables.`)
    } else {
      console.log("No tables to expire.")
    }
  }

  async createTable(userId: string, userName: string, ruleType: string) {
    const tableId = crypto.randomUUID().slice(0, 8)
    const creator: Player = { id: userId, name: userName || "Anonymous" }

    const newTable: Table = {
      id: tableId,
      creator,
      players: [creator],
      spectators: [],
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
      isActive: true,
      ruleType,
    }

    await this.store.hset(KEY, { [tableId]: newTable })
    await this.notify({ action: "spectate" })

    return newTable
  }

  async joinTable(tableId: string, userId: string, userName: string) {
    const table = await this.store.hget<Table>(KEY, tableId)

    if (!table) {
      throw new Error("Table not found")
    }

    if (table.players.length >= 2) {
      throw new Error("Table is full")
    }

    const player: Player = { id: userId, name: userName || "Anonymous" }
    table.players.push(player)
    table.lastUsedAt = Date.now()

    await this.store.hset(KEY, { [tableId]: table })
    await this.notify({ action: "join" })
    return table
  }

  async spectateTable(tableId: string, userId: string, userName: string) {
    const table = await this.store.hget<Table>(KEY, tableId)

    if (!table) {
      throw new Error("Table not found")
    }

    const spectator: Player = { id: userId, name: userName || "Anonymous" }
    table.spectators.push(spectator)
    table.lastUsedAt = Date.now()

    await this.store.hset(KEY, { [tableId]: table })
    await this.notify({ action: "spectate" })
    return table
  }

  async defaultNotify(event: any) {
    await new NchanPub("lobby").post(event)
  }
}
