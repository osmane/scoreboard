import { mockKv } from "./mockvercelkvadapter"
import { ScoreTable } from "../services/scoretable"
import { VercelKV } from "@vercel/kv"
import { Table } from "@/services/interfaces"

describe("ScoreTable", () => {
  afterEach(async () => {
    await mockKv.flushall()
  })

  it("should add a new high score and like it", async () => {
    const scoreTable = new ScoreTable(mockKv as VercelKV)
    await scoreTable.add("nineball", 100, "user", { some: "data" })
    const items = await scoreTable.topTen("nineball")
    console.log(items)
    expect(items).toHaveLength(1)
    const item = items[0]
    expect(item.name).toEqual("user")
    expect(item.score).toEqual(100)
    expect(item.likes).toEqual(0)
    await scoreTable.like("nineball", item.id)
    const likedItem = await scoreTable.getById("nineball", item.id)
    expect(likedItem.likes).toEqual(1)
  })

  function makeTable(lastUsed: number, tableId: string): Table {
    const newTable: Table = {
      id: tableId,
      creator: { id: "creator01", name: "user01" },
      players: [{ id: "creator01", name: "user01" }],
      spectators: [],
      createdAt: lastUsed,
      lastUsedAt: lastUsed,
      isActive: true,
      ruleType: "nineball",
    }
    return newTable
  }

  /*
  const KEY= "tables"

  it("should expire old table and keep recent one", async () => {
    const scoreTable = new ScoreTable(mockKv as VercelKV)
    const tableOld = makeTable(Date.now() - 1000 * 60 * 60 * 24, "old")
    await mockKv.hset(KEY, { ["old"]: tableOld })
    await scoreTable.add("nineball", 100, "user", { some: "data" })
    const items = await scoreTable.topTen("nineball")
    console.log(items)
    expect(items).toHaveLength(2)
  })
*/
})
