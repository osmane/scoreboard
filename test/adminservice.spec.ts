import request from "supertest"
import server from "../src/server"
import { AdminService } from "../src/services/admin/adminservice"
import crypto from "crypto"

beforeAll(() => {
  AdminService.uuid = crypto.createHash("sha1").update("test").digest("hex")
})

afterAll(async () => {
  await server.close()
})

describe("adminService", () => {
  test("list ok", async () => {
    const response = await request(server).get("/admin/list/test/other")
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual([])
  })

  test("delete not found", async () => {
    const response = await request(server).delete(
      "/admin/delete/test/other/key"
    )
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual(false)
  })

  test("get ok", async () => {
    const response = await request(server).get("/admin/get/test/other/somekey")
    expect(response.statusCode).toBe(200)
  })
})
