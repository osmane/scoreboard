import { CyclicDb } from "./cyclicdb"
import { LocalDb } from "./localdb"

export class DbFactory {
  static getDb() {
    if (process.env.CYCLIC_DB) {
      console.log("Cyclic DB")
      return new CyclicDb()
    }
    console.log("Local DB")
    return new LocalDb()
  }
}
