import { Db } from "../../db/db"
import { DbFactory } from "../../db/dbfactory"
import { Express } from "express"
import { Shortener } from "./shortener"
export class ShortenService {
  readonly store: Db = DbFactory.getDb()
  readonly app: Express
  readonly shortener: Shortener

  constructor(app: Express) {
    this.app = app
    this.shortener = new Shortener(this.store)
  }

  register() {
    this.app.post("/shorten", async (req, res) => {
      res.json(await this.shortener.shorten({ input: req.body.input })).end()
    })

    this.app.get("/replay/:key", async (req, res) => {
      res.redirect(await this.shortener.replay(req.params.key))
    })

    this.app.get("/replay", async (_, res) => {
      res.json(await this.shortener.keyFountain())
    })
  }
}
