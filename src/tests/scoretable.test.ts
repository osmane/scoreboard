import { MockVercelKVAdapter } from "./mockvercelkvadapter"
import { ScoreTable } from "../services/scoretable"

describe("ScoreTable", () => {
  let mockStore: MockVercelKVAdapter

  beforeEach(() => {
    mockStore = new MockVercelKVAdapter()
  })

  afterEach(async () => {
    await mockStore.flushall()
  })

  it("should add a new high score and like it", async () => {
    const scoreTable = new ScoreTable(mockStore)
    await scoreTable.add("nineball", 100, "user", { some: "data" })
    mockStore.printMockRedisData()
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
})
