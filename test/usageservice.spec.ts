import request from "supertest"
import server from "../src/index"
import { DbFactory } from "../src/db/dbfactory"
import { UsageService } from "../src/services/usage/usageservice"

afterAll(async () => {
  await server.close()
})

describe("usageService", () => {
  test("adds usage ok", async () => {
    const response = await request(server).get("/usage/a/b")
    expect(response.statusCode).toBe(200)

    const items = await DbFactory.getDb().list(UsageService.collection)
    expect(items).toHaveLength(1)
    expect(items[0].props.mode).toBe("a")
    expect(parseInt(items[0].key)).toBeLessThan(new Date().getTime())
  })
})
