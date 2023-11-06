import { CyclicDb } from "./cyclicdb"
import { LocalDb } from "./localdb"

export class DbFactory {
  static getDb() {
    if (process.env.CYCLIC_DB) {
      console.log("using Cyclic DB")
      return new CyclicDb()
    }
    console.log("using Local DB")
    return new LocalDb()
  }
}
