export class LocalDb implements Db {
  readonly store = new Map<string, any>()

  set(collection: string, key: string, props: any): Promise<DbItem> {
    this.store.set(key, props)
    return new Promise<DbItem>((res, rej) => {
      res({ collection: collection, key: key, props: props })
      return
    })
  }

  list(collection: string): Promise<DbItem[]> {
    const result: DbItem[] = []
    this.store.forEach((value, key) => {
      result.push({ collection: collection, key: key, props: value })
    })
    return new Promise<DbItem[]>((res, rej) => {
      res(result)
      return
    })
  }
}
