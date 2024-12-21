export interface ScoreData {
  name: string
  score: number
  data: string
}

export class ScoreTable {
  readonly prefix = "hiscore"
  readonly replayUrl = "https://tailuge.github.io/billiards/dist/"
  readonly notFound = "https://scoreboard-tailuge.vercel.app/notfound.html"

  constructor(private readonly store: any) {}

  dbKey(ruletype) {
    return `${this.prefix}${ruletype}`
  }

  async add(ruletype: string, score: number, name: string, data: any) {
    const scoreData: ScoreData = { name: name, score: score, data: data }
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
      score: Math.floor(row.score),
    }))
  }

  async get(ruletype: string, index: number) {
    const data = await this.store.zrange(this.dbKey(ruletype), index, index)
    if (data.length === 0) return this.notFound
    const item = data[0] as ScoreData
    return this.formatReplayUrl(item.data)
  }
}
