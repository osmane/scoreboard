export class LocalDb implements Db {
  readonly store = new Map<string, any>()

  async delete(collection: string, key: string): Promise<boolean> {
    return new Promise<boolean>((res, _) => {
      res(this.store.delete(key))
      return
    })
  }

  async get(collection: string, key: string): Promise<DbItem> {
    return new Promise<DbItem>((res, _) => {
      res({ collection: collection, key: key, props: this.store.get(key) })
      return
    })
  }

  async set(collection: string, key: string, props: any): Promise<DbItem> {
    this.store.set(key, props)
    return new Promise<DbItem>((res, _) => {
      res({ collection: collection, key: key, props: props })
      return
    })
  }

  async list(collection: string): Promise<DbItem[]> {
    const result: DbItem[] = []
    this.store.forEach((value, key) => {
      result.push({ collection: collection, key: key, props: value })
    })
    return new Promise<DbItem[]>((res, _) => {
      res(result)
      return
    })
  }
}
