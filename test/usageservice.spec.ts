import request from "supertest"
import server from "../src/index"
import { DbFactory } from "../src/db/dbfactory"
import { UsageService } from "../src/services/usage/usageservice"

afterAll(async () => {
  await server.close()
})

describe("usageService", () => {
  test("adds usage ok", async () => {
    const now = new Date().toISOString().split(":")[0]
    const response = await request(server).get("/usage/play/snooker")
    expect(response.statusCode).toBe(200)
    await request(server).get("/usage/play/snooker")
    await request(server).get("/usage/replay/threecushion")

    const items = await DbFactory.getDb().list(UsageService.collection)
    expect(items).toHaveLength(1)
    expect(items[0].key).toBe(now)
    expect(items[0].props.snooker).toBe(2)

    const usage = await request(server).get("/usage")
    expect(usage.statusCode).toBe(200)
    expect(usage.body).toHaveLength(1)
  })
})
