import db from "@cyclic.sh/dynamodb"
import { Db, DbItem } from "./db"

export class CyclicDb implements Db {
  readonly opts = {}

  async delete(collection: string, key: string): Promise<boolean> {
    return db.collection(collection).delete(key, {}, this.opts)
  }

  async get(collection: string, key: string): Promise<DbItem> {
    return db.collection(collection).get(key)
  }

  async set(collection: string, key: string, props: any): Promise<DbItem> {
    return db.collection(collection).set(key, props, this.opts)
  }

  async list(collection: string): Promise<DbItem[]> {
    return db
      .collection(collection)
      .list()
      .then((items) => {
        return items.results
      })
      .catch((_) => {
        return []
      })
  }
}
