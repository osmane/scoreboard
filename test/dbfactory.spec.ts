import { DbFactory } from "../src/db/dbfactory"
//import { CyclicDb } from "../src/db/cyclicdb"
import { LocalDb } from "../src/db/localdb"

describe("DbFactory", () => {
  /*
  it("CYCLIC_DB is set", () => {
    DbFactory.store = null
    process.env.CYCLIC_DB = "true"
    const db = DbFactory.getDb()
    expect(db).toBeInstanceOf(CyclicDb)
    delete process.env.CYCLIC_DB
  })
*/
  it("should produce LocalDb", () => {
    DbFactory.store = null
    const db = DbFactory.getDb()
    expect(db).toBeInstanceOf(LocalDb)
    const dbother = DbFactory.getDb()
    expect(db === dbother).toBeTruthy()
  })
})
