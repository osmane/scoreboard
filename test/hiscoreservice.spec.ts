import request from "supertest"
import server from "../src/index"
import { DbFactory } from "../src/db/dbfactory"
import { LocalDb } from "../src/db/localdb"

afterAll(async () => {
  await server.close()
})

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
  const db = DbFactory.getDb() as LocalDb
  db.collections.clear()
})

const newbreak = `?ruletype=snooker&state=VinitSL6406B2379X52B24JX5Y2398X4YH14BH13*H08*72021027601J084BZ93958946339586%2C1.J78BH03*78728852561H557*H4315909043927362*8551584784395455*0872210687752198*852096628067575B027147532532769972*999272574305660Y274107119952841Y9163B07J*8860966220J0747*18657639J469%5D~shotsSDWOL7502F6406TW2379QDL02ZZZHO1.1654F9485TW5451QPRERACK%27~ballinfo!VballsSV_1.J9T0Gid!6)%5D))%5D~startU215J~nowU34732~score!8)*%2CLB%2CWDPAIM%27~offsetNW04TF~power!2.16~_LG~z!0)~H00J17L0.N!Vx!O18Gangle!PVtype!%27QGi!0)%2CS!%5BT~y!U!JH1288V(%27W-LXB86Y6*ZHH_posN%01_ZYXWVUTSQPONLJHGFDB*_`

describe("hiscoreService", () => {
  test("add new high score", async () => {
    const response = await request(server)
      .post(`/hiscore${newbreak}`)
      .send({ initials: "abc", score: 8, start: Date.now() })
    expect(response.status).toBe(200)
    expect(response.body.valid).toBe(true)

    const highscores = await request(server).get("/allscores")
    console.log(highscores.body)
    expect(highscores.status).toBe(200)
    console.log(highscores.body)
    expect(highscores.body).toHaveLength(1)
  })
})
