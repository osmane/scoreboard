import request from "supertest"
import server from "../src/index"

afterAll(async () => {
  await server.close()
})

describe("service root", () => {
  test("root responds with html", async () => {
    const response = await request(server).get("/")
    expect(response.statusCode).toBe(200)
    expect(response.header["content-type"]).toBe("text/html; charset=UTF-8")
  })

  test("unknown route", async () => {
    const response = await request(server).get("/xyz")
    expect(response.statusCode).toBe(200)
  })
})
