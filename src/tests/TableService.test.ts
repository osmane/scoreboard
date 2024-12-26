import { Table } from "@/services/interfaces"
import { TableService } from "../services/TableService"
import { mockKv } from "./mockkv"
import { VercelKV } from "@vercel/kv"

describe("TableService", () => {
  let tableService: TableService

  beforeAll(() => {
    tableService = new TableService(mockKv as VercelKV, (_) =>
      Promise.resolve()
    )
  })

  afterEach(async () => {
    await mockKv.flushall()
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

  it("should create a new table", async () => {
    const userId = "user1"
    const userName = "User One"
    const ruleType = "standard"

    const newTable = await tableService.createTable(userId, userName, ruleType)

    expect(newTable).toHaveProperty("id")
    // Verify the table is stored in the mock Redis
    const tables = await tableService.getTables()
    expect(tables).toHaveLength(1)
  })
})
