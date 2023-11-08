import request from "supertest"
import server from "../src/index"

afterAll(async () => {
  await server.close()
})

describe("shortenService", () => {
  test("not found ok", async () => {
    const response = await request(server).get("/replay/99")
    expect(response.redirect).toBe(true)
    expect(response.header.location).toBe(
      "https://tailuge-billiards.cyclic.app/notfound.html"
    )
  })

  test("shorten ok", async () => {
    const response = await request(server)
      .post("/shorten")
      .send({ input: "longurl" })
    expect(response.status).toBe(200)
    expect(response.body.shortUrl).toBe(
      "https://tailuge-billiards.cyclic.app/replay/1"
    )
    const replayresponse = await request(server).get("/replay/1")
    expect(replayresponse.redirect).toBe(true)
    expect(replayresponse.header.location).toBe(
      "https://tailuge.github.io/billiards/dist/longurl"
    )
  })
})
