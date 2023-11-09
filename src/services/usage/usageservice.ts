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
      const key = new Date().toISOString().split(":")[0]
      const mode = req.params.mode
      const ruletype = req.params.ruletype
      const item = (await this.store.get(UsageService.collection, key)) ?? {
        props: {},
      }
      const props = item.props
      props[mode] = (props[mode] ?? 0) + 1
      props[ruletype] = (props[ruletype] ?? 0) + 1
      this.store.set(UsageService.collection, key, props)
      res.json("thankyou")
    })

    this.app.get("/usage", async (_, res) => {
      const items = await this.store.list(UsageService.collection)
      const values = await Promise.all(
        items.map((item) => this.store.get(UsageService.collection, item.key!))
      )
      res.json(values)
    })
  }
}
