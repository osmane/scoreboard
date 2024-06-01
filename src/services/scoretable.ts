import { VercelKV } from "@vercel/kv"

export class ScoreTable {
  readonly store: VercelKV
  readonly prefix = "hiscore"

  constructor(store: VercelKV) {
    this.store = store
  }

  dbKey(ruletype) {
    return `${this.prefix}${ruletype}`
  }

  async add(ruletype: string, score: number, name: string, data: any) {
    const value = { name: name, score:score, data: data }
    await this.store.zadd(this.dbKey(ruletype), {
      score: score,
      member: value,
    })
    return this.trim(ruletype)
  }

  async trim(ruletype: string) {
    return await this.store.zremrangebyscore(this.dbKey(ruletype), 0, -11)
  }

  async topTen(ruletype: string) {
    return (await this.store.zrange(this.dbKey(ruletype),0,9)).reverse()
  }
}
