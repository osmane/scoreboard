import { VercelKV, kv } from "@vercel/kv"
import { NchanPub } from "../nchan/nchanpub"
// 'table.ts' dosyasından Table arayüzünü import ediyoruz
import { Table } from "./table"

const KEY = "tables"

// Geliştirme ortamı için hafıza içi depolama
let devTables: Record<string, Table> = {};

// Ön yüzün beklediği kural objelerini tanımlıyoruz
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
    await this.expireTables()
    const tables = await this.store.hgetall<Record<string, Table>>(KEY)
    return Object.values(tables || {})
  }

  async createTable(table: Table): Promise<Table> {
    if (process.env.NODE_ENV === 'development') {
      devTables[table.id] = table;
    } else {
      await this.store.hset(KEY, { [table.id]: table })
    }

    // table.ruleType (örn: "snooker") kullanarak tam kural objesini bul
    const ruleObject = rules.find(r => r.id === table.ruleType);

    // Ön yüzün beklediği formatta bir obje oluştur
    const plainTableObject = {
        id: table.id,
        players: table.players,
        rule: ruleObject, // Artık tam obje gönderiliyor
        createdAt: table.createdAt,
        lastUsedAt: table.lastUsedAt,
        // Diğer gerekli alanlar da eklenebilir
        creator: table.creator,
        spectators: table.spectators,
        isActive: table.isActive,
        completed: table.completed
    };

    // Bildirime bu yeni ve doğru objeyi gönder
    await this.notify({ type: "create", table: plainTableObject });
    
    return table;
  }
  
  // ----- Dosyanın geri kalanı aynı kalabilir -----

  async getTable(id: string): Promise<Table | null> {
    if (process.env.NODE_ENV === 'development') {
      return devTables[id] || null;
    }
    return await this.store.hget(KEY, id)
  }

  async updateTable(table: Table): Promise<Table> {
    if (process.env.NODE_ENV === 'development') {
      devTables[table.id] = table;
    } else {
      await this.store.hset(KEY, { [table.id]: table })
    }
    // NOT: update ve delete için de benzer bir obje dönüşümü gerekebilir,
    // ama şimdilik sadece 'create' hatasını çözüyoruz.
    await this.notify({ type: "update", table: table })
    return table
  }

  async deleteTable(id: string) {
    if (process.env.NODE_ENV === 'development') {
      delete devTables[id];
    } else {
      await this.store.hdel(KEY, id)
    }
    await this.notify({ type: "delete", tableId: id })
  }

  private async expireTables() {
    if (process.env.NODE_ENV === "development") {
      return;
    }
    const tables = await this.store.hgetall<Record<string, Table>>(KEY)
    const expiredEntries = Object.entries(tables || {}).filter(
      ([, table]) =>
        Date.now() - table.lastUsedAt > 1000 * 60 * 60 * 24 * 7 // 1 week
    )
    if (expiredEntries.length > 0) {
      await this.store.hdel(KEY, ...expiredEntries.map(([key]) => key))
    }
  }
}

export const tableService = new TableService()