import { Db, DbItem } from "./db"

export class LocalDb implements Db {
  incr(key: string): Promise<number> {
    throw new Error("Method not implemented.")
  }
  set(key: string, value: any) {
    throw new Error("Method not implemented.")
  }
  get(key: string): Promise<DbItem> {
    throw new Error("Method not implemented.")
  }
  readonly store = new Map<string, any>()
}
