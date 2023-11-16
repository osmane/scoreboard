import { Db } from "../../db/db"
import { DbFactory } from "../../db/dbfactory"
import { Express } from "express"
import { Shortener } from "../shortener/shortener"

export class HiscoreService {
  readonly store: Db = DbFactory.getDb()
  readonly app: Express
  static readonly collection = "hiscore"
  readonly shortener: Shortener

  constructor(app: Express) {
    this.app = app
    this.shortener = new Shortener(this.store)
  }

  register() {
    this.app.post("/hiscore", async (req, res) => {
      const ruletype = req.query.ruletype! as string
      const state = req.query.state! as string
      const initials = req.body.initials
      const score = req.body.score
      const start = req.body.start
      // check if within top 100 in category
      const check = this.validate()
      if (check.valid) {
        // shorten
        const paramString = `?ruletype=${ruletype}&state=${state}`
        const shortened = await this.shortener.shorten(paramString)
        const info = {
          shortUrl: shortened.shortUrl,
          score: score,
          date: start,
          initials: initials,
          ruletype: ruletype,
        }

        const storeditem = await this.store.set(
          HiscoreService.collection,
          state,
          info
        )
        console.log(storeditem)
      }
      res.json(check)
    })

    this.app.get("/leaderboard", async (_, res) => {
      const values = await this.getAll()
      res.json(values)
    })
  }

  async getAll() {
    const items = await this.store.list(HiscoreService.collection)
    return await Promise.all(
      items.map((item) => this.store.get(HiscoreService.collection, item.key!))
    )
  }

  validate() {
    return { valid: true, reason: "" }
  }
}
