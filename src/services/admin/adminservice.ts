import { Db } from "../../db/db"
import { DbFactory } from "../../db/dbfactory"
import { Express } from "express"
import crypto from "crypto"

export class AdminService {
  readonly store: Db = DbFactory.getDb()
  readonly app: Express
  static uuid = "d41686e6bd4348519fafc3b040bf6827842b271b"

  constructor(app: Express) {
    this.app = app
  }

  register() {
    this.app.delete("/admin/delete/:auth/:col/:key", async (req, res) => {
      const id = crypto.createHash("sha1").update(req.params.auth).digest("hex")
      const col = req.params.col
      const key = req.params.key
      const item =
        id === AdminService.uuid ? await this.store.delete(col, key) : false
      res.json(item).end()
    })

    this.app.get("/admin/list/:auth/:col", async (req, res) => {
      const id = crypto.createHash("sha1").update(req.params.auth).digest("hex")
      const col = req.params.col
      const item = id === AdminService.uuid ? await this.store.list(col) : []
      res.json(item).end()
    })
  }
}
