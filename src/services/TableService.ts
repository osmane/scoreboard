import { VercelKV, kv } from "@vercel/kv";
import { NchanPub } from "../nchan/nchanpub";
import { Table } from "./table";
import { Player } from "./player"; // Player arayüzünü import ediyoruz

const KEY = "tables";

let devTables: Record<string, Table> = {};

const rules = [
  { id: "snooker", name: "Snooker" },
  { id: "nineball", name: "9-Ball" },
  { id: "eightball", name: "8-Ball" },
  { id: "straight", name: "14.1" },
  { id: "threecushion", name: "3-Cushion" },
];

export class TableService {
  constructor(
    private readonly store: VercelKV = kv,
    private readonly notify: (event: any) => Promise<void> = new NchanPub(
      "lobby"
    ).post.bind(new NchanPub("lobby"))
  ) {}

  async getTables(): Promise<Table[]> {
    if (process.env.NODE_ENV === 'development') {
      return Object.values(devTables);
    }
    await this.expireTables();
    const tables = await this.store.hgetall<Record<string, Table>>(KEY);
    return Object.values(tables || {});
  }

  // Önceki adımdaki createTable imzasını düzeltiyoruz ve içeriği koruyoruz
  async createTable(userId: string, userName: string, ruleType: string): Promise<Table> {
    const newTable: Table = {
        id: crypto.randomUUID(),
        creator: { id: userId, name: userName },
        players: [{ id: userId, name: userName }],
        spectators: [],
        createdAt: Date.now(),
        lastUsedAt: Date.now(),
        isActive: true,
        ruleType: ruleType,
        completed: false,
    };

    if (process.env.NODE_ENV === 'development') {
      devTables[newTable.id] = newTable;
    } else {
      await this.store.hset(KEY, { [newTable.id]: newTable });
    }

    const ruleObject = rules.find(r => r.id === newTable.ruleType);

    const plainTableObject = {
        id: newTable.id,
        players: newTable.players,
        rule: ruleObject,
        createdAt: newTable.createdAt,
        lastUsedAt: newTable.lastUsedAt,
        creator: newTable.creator,
        spectators: newTable.spectators,
        isActive: newTable.isActive,
        completed: newTable.completed
    };
    
    await this.notify({ type: "create", table: plainTableObject });
    
    return newTable;
  }

  async getTable(id: string): Promise<Table | null> {
    if (process.env.NODE_ENV === 'development') {
      return devTables[id] || null;
    }
    return await this.store.hget(KEY, id);
  }

  async updateTable(table: Table): Promise<Table> {
    table.lastUsedAt = Date.now();
    if (process.env.NODE_ENV === 'development') {
      devTables[table.id] = table;
    } else {
      await this.store.hset(KEY, { [table.id]: table });
    }
    await this.notify({ type: "update", table: table });
    return table;
  }
  
  // YENİ EKLENEN METODLAR
  async joinTable(tableId: string, userId: string, userName: string): Promise<Table> {
    const table = await this.getTable(tableId);
    if (!table) {
      throw new Error("Table not found");
    }
    if (table.players.length >= 2) {
      throw new Error("Table is full");
    }
    if (!table.players.find(p => p.id === userId)) {
        table.players.push({ id: userId, name: userName });
    }
    return this.updateTable(table);
  }

  async spectateTable(tableId: string, userId: string, userName: string): Promise<Table> {
      const table = await this.getTable(tableId);
      if (!table) {
          throw new Error("Table not found");
      }
      if (!table.spectators.find(p => p.id === userId) && !table.players.find(p => p.id === userId)) {
          table.spectators.push({ id: userId, name: userName });
      }
      return this.updateTable(table);
  }

  async completeTable(tableId: string): Promise<Table> {
      const table = await this.getTable(tableId);
      if (!table) {
          throw new Error("Table not found");
      }
      table.completed = true;
      return this.updateTable(table);
  }
  // ---

  async deleteTable(id: string) {
    if (process.env.NODE_ENV === 'development') {
      delete devTables[id];
    } else {
      await this.store.hdel(KEY, id);
    }
    await this.notify({ type: "delete", tableId: id });
  }

  private async expireTables() {
    if (process.env.NODE_ENV === "development") {
      return;
    }
    const tables = await this.store.hgetall<Record<string, Table>>(KEY);
    const expiredEntries = Object.entries(tables || {}).filter(
      ([, table]) =>
        Date.now() - table.lastUsedAt > 1000 * 60 * 60 * 24 * 7 // 1 week
    );
    if (expiredEntries.length > 0) {
      await this.store.hdel(KEY, ...expiredEntries.map(([key]) => key));
    }
  }
}

export const tableService = new TableService();