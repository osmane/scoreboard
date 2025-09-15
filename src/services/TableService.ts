import { kv, VercelKV } from "@vercel/kv"
import { Table } from "@/services/table"
import { NchanPub } from "@/nchan/nchanpub"
import { Player } from "./player"

const KEY = "tables"
const TABLE_TIMEOUT = 60 * 1000 // Eskimiş masaları 1 dakika sonra siler

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
    if (!tables) return 0;
    
    const expiredEntries = Object.entries(tables).filter(
      ([, table]) =>
        Date.now() - table.lastUsedAt >
        (table.players.length > 1 ? TABLE_TIMEOUT * 10 : TABLE_TIMEOUT)
    )
    
    if (expiredEntries.length > 0) {
      const keysToDelete = expiredEntries.map(([key]) => key)
      await this.store.hdel(KEY, ...keysToDelete)
      console.log(`Expired ${expiredEntries.length} tables.`)
    }
    return expiredEntries.length
  }

  async createTable(userId: string, userName: string, ruleType: string) {
    const tableId = crypto.randomUUID()
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
      completed: false,
    }

    await this.store.hset(KEY, { [tableId]: newTable })
    await this.notify({ action: "create" })
    return newTable
  }

  async joinTable(tableId: string, userId: string, userName: string) {
    await this.expireTables()

    const table = await this.store.hget<Table>(KEY, tableId)
    if (!table) {
      await this.notify({ action: "expired table" })
      throw new Error("Table not found")
    }

    if (table.players.length >= 2) {
      throw new Error("Table is full")
    }

    if (!table.players.find(p => p.id === userId)) {
        const player: Player = { id: userId, name: userName || "Anonymous" }
        table.players.push(player)
    }
    
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
    
    if (!table.spectators.find(p => p.id === userId) && !table.players.find(p => p.id === userId)) {
        const spectator: Player = { id: userId, name: userName || "Anonymous" }
        table.spectators.push(spectator)
    }

    table.lastUsedAt = Date.now()

    await this.store.hset(KEY, { [tableId]: table })
    await this.notify({ action: "spectate" })
    return table
  }

  async completeTable(tableId: string) {
    const table = await this.store.hget<Table>(KEY, tableId)

    if (!table) {
      throw new Error("Table not found")
    }

    table.lastUsedAt = Date.now()
    table.completed = true
    await this.store.hset(KEY, { [tableId]: table })
    await this.notify({ action: "complete" })
    return table
  }
  
  async deleteTable(id: string) {
    await this.store.hdel(KEY, id);
    await this.notify({ type: "delete", tableId: id });
  }

  async defaultNotify(event: any) {
    await new NchanPub("lobby").post(event)
  }
}

export const tableService = new TableService();