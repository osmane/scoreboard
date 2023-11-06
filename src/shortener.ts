import { DbFactory } from "./db/dbfactory"

export class Shortener {
  readonly collection = "short"
  readonly store: Db
  readonly replayUrl = "https://tailuge.github.io/billiards/dist/"
  readonly shortUrl = "https://tailuge-billiards.cyclic.app/replay/"

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
    return {
      input: data.input,
      key: key,
      shortUrl: this.shortUrl + key,
    }
  }

  async replay(key: string) {
    const item = await this.store.get(this.collection, key)
    console.log(item)
    const fullUrl = this.replayUrl + item.props.input
    return fullUrl
  }
}
