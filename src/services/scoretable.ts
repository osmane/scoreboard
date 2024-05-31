import { VercelKV } from "@vercel/kv"

export class ScoreTable {
  readonly store: VercelKV
  readonly prefix = "hiscore"

  constructor(store: VercelKV) {
    this.store = store
  }

  async keyFountain() {
    const id = await this.store.incr("idfountain")
    return id
  }

  dbKey(id) {
    return `${this.prefix}${id}`
  }

  async add(gametype: string, score: number, name: string, data: any) {
    const value = { name: name, data: data }
    return await this.store.zadd(this.dbKey(gametype), {
      score: score,
      member: data,
    })
  }

  async trim(gametype: string) {
    return await this.store.zremrangebyscore(this.dbKey(gametype), 0, -11)
  }

  async topTen(gametype: string) {
    return await this.store.zrange(this.dbKey(gametype),0,9)
  }
}
