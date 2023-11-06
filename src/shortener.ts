import { DbFactory } from "./db/dbfactory"

export class Shortener {
  readonly collection = "short"
  readonly store: Db
  readonly url = "https://tailuge.github.io/billiards/dist/"

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
    console.log("next free key: ", key)
    await this.store.set(this.collection, key, data)
    return key
  }

  async replay(key: string) {
    const item = await this.store.get(this.collection, key)
    console.log(item)
    const fullUrl = this.url + item.props.input
    return fullUrl
  }
}
