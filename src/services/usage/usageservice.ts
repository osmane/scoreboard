import { Db } from "../../db/db"
import { DbFactory } from "../../db/dbfactory"
import { Express } from "express"

export class UsageService {
  readonly store: Db = DbFactory.getDb()
  readonly app: Express
  static readonly collection = "usage"

  constructor(app: Express) {
    this.app = app
  }

  register() {
    this.app.get("/usage/:mode/:ruletype", async (req, res) => {
      this.store.set(
        UsageService.collection,
        new Date().getTime().toString(),
        req.params
      )
      res.json("thankyou")
    })
  }
}
