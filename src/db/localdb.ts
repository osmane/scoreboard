import { Db, DbItem } from "./db"

export class LocalDb implements Db {
  readonly store = new Map<string, any>()

  async delete(_: string, key: string): Promise<boolean> {
    return Promise.resolve(this.store.delete(key))
  }

  async get(collection: string, key: string): Promise<DbItem | null> {
    const item = this.store.get(key)
    if (item) {
      return Promise.resolve({
        collection: collection,
        key: key,
        props: item,
      })
    }
    return Promise.resolve(null)
  }

  async set(collection: string, key: string, props: any): Promise<DbItem> {
    this.store.set(key, props)
    return Promise.resolve({ collection: collection, key: key, props: props })
  }

  async list(collection: string): Promise<DbItem[]> {
    const result: DbItem[] = []
    this.store.forEach((value, key) => {
      result.push({ collection: collection, key: key, props: value })
    })
    return Promise.resolve(result)
  }
}
