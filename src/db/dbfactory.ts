import { Db } from "./db"
import { kv } from "@vercel/kv"

export class DbFactory {
  static store: Db

  static getDb() {
    if (!DbFactory.store) {
      DbFactory.store = kv
    }
    return DbFactory.store
  }
}
