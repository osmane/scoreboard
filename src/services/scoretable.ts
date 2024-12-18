export interface ScoreData {
  name: string
  score: number
  data: string
}

export class ScoreTable {
  readonly prefix = "hiscore"
  readonly replayUrl = "https://tailuge.github.io/billiards/dist/"
  
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

  async topTen(ruletype: string) {
    const data = (await this.store.zrange(this.dbKey(ruletype), 0, 9)).reverse()
    data.forEach((row) => {
      const r = row as ScoreData
      r.data = this.replayUrl + r.data
      r.score = Math.floor(r.score)
    })
    return data
  }
}
