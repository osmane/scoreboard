import { Db, DbItem } from "./db"

export class LocalDb implements Db {
  readonly collections = new Map<string, Map<string, any>>()
  readonly store = new Map<string, any>()

  async delete(collection: string, key: string): Promise<boolean> {
    const store = this.getCollection(collection)
    return Promise.resolve(store.delete(key))
  }

  async get(collection: string, key: string): Promise<DbItem | null> {
    const store = this.getCollection(collection)
    const item = store.get(key)
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
    const store = this.getCollection(collection)
    store.set(key, props)
    return Promise.resolve({ collection: collection, key: key, props: props })
  }

  async list(collection: string): Promise<DbItem[]> {
    const store = this.getCollection(collection)
    const result: DbItem[] = []
    store.forEach((value, key) => {
      result.push({ collection: collection, key: key, props: value })
    })
    return Promise.resolve(result)
  }

  getCollection(collection) {
    if (!this.collections.has(collection)) {
      this.collections.set(collection, new Map<string, any>())
    }
    return this.collections.get(collection)!
  }
}
