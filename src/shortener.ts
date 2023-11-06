import { DbFactory } from "./db/dbfactory"

export class Shortener {
  readonly collection = "short"
  readonly store: Db

  constructor(store: Db) {
    this.store = store
  }

  async keyFountain() {
    const items = await this.store.list(this.collection)
    return (
      1 +
      items
        .map((item) => Number.parseInt(item.key ?? "0"))
        .reduce((a, b) => Math.max(a, b), 0)
    )
  }

  async shorten(data: any) {
    const key = (await this.keyFountain()).toString()
    console.log(key, "here", data)
    await this.store.set(this.collection, key, data)
    return key
  }

  async replay(key: string) {
    const params = await this.store.get(this.collection, key)
    console.log(params)
    return params?.props
  }
}
