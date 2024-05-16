//import { CyclicDb } from "./cyclicdb"
//import { Db } from "./db"
import { LocalDb } from "./localdb"

export class DbFactory {
  static store

  static getDb() {
    if (!DbFactory.store) {
      DbFactory.store = process.env.CYCLIC_DB ? new LocalDb() : new LocalDb()
    }
    return DbFactory.store
  }
}
