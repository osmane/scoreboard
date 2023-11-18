import { Db } from "../../db/db"
import { DbFactory } from "../../db/dbfactory"
import { Express } from "express"
import { Shortener } from "../shortener/shortener"
import crypto from "crypto"

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
      const now = req.body.now
      const wholeGame = req.body?.wholeGame ?? false
      const hash = crypto.createHash("md5").update(state).digest("hex")

      const check = await this.validate(hash, start)
      if (check.valid) {
        // shorten
        const paramString = `?ruletype=${ruletype}&state=${state}`
        const shortened = await this.shortener.shorten({ input: paramString })
        const info = {
          shortUrl: shortened.shortUrl,
          score: score,
          date: start,
          elapsed: now - start,
          initials: initials,
          ruletype: ruletype,
          wholeGame: wholeGame,
        }
        check["id"] = hash
        const storeditem = await this.store.set(
          HiscoreService.collection,
          hash,
          info
        )
        console.log("stored hiscore:", storeditem)
      }
      res.json(check)
    })

    this.app.get("/allscores", async (_, res) => {
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

  async validate(hash, start) {
    const allscores = await this.getAll()
    if (Date.now() - start > 1000 * 60 * 10) {
      return { valid: false, reason: "expired" }
    }
    if (allscores.some((item) => item?.key === hash)) {
      return { valid: false, reason: "already uploaded" }
    }
    return { valid: true, reason: "" }
  }
}
