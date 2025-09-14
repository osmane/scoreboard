import { VercelKV } from "@vercel/kv"

export interface ScoreData {
  name: string
  score: number
  data: string
  likes: number
  id: string
}

export class ScoreTable {
  readonly prefix = "hiscore"
  readonly replayUrl = "https://osmane.github.io/billiards/"
  readonly notFound = "https://scoreboard-osmane.vercel.app/notfound.html"

  constructor(private readonly store: VercelKV) {}

  dbKey(ruletype) {
    return `${this.prefix}${ruletype}`
  }

  async add(ruletype: string, score: number, name: string, data: any) {
    const scoreData: ScoreData = {
      name: name,
      score: score,
      data: data,
      likes: 0,
      id: this.generateUID(),
    }
    await this.store.zadd(this.dbKey(ruletype), {
      score: score,
      member: scoreData,
    })
    return this.trim(ruletype)
  }

  async trim(ruletype: string) {
    return await this.store.zremrangebyrank(this.dbKey(ruletype), 0, -11)
  }

  private formatReplayUrl(data: string): string {
    return this.replayUrl + data
  }

  async topTen(ruletype: string) {
    const data = (await this.store.zrange(this.dbKey(ruletype), 0, 9)).reverse()
    return data.map((row: ScoreData) => ({
      name: row.name,
      likes: row.likes ?? 0,
      id: row.id,
      score: Math.floor(row.score),
    }))
  }

  async getById(ruletype: string, id: string): Promise<ScoreData> {
    const data = await this.store.zrange(this.dbKey(ruletype), 0, 9)
    return data
      .map((item: any) => ({
        name: item.name,
        score: item.score,
        data: item.data,
        likes: item.likes,
        id: item.id,
      }))
      .find((item: ScoreData) => item.id === id)
  }

  async like(ruletype: string, id: string) {
    console.log("like", ruletype, id)
    const item = await this.getById(ruletype, id)
    console.log("item", item)
    await this.store.zrem(this.dbKey(ruletype), item)
    item.likes = (item.likes ?? 0) + 1
    await this.store.zadd(this.dbKey(ruletype), {
      score: item.score,
      member: item,
    })
    return item.likes
  }

  async get(ruletype: string, id: string) {
    const item = await this.getById(ruletype, id)
    return this.formatReplayUrl(item.data)
  }

  generateUID() {
    const a = (Math.random() * 46656) | 0
    const b = (Math.random() * 46656) | 0
    return (
      ("000" + a.toString(36)).slice(-3) + ("000" + b.toString(36)).slice(-3)
    )
  }
}
