import express, { Express } from "express"
import { DbFactory } from "./db/dbfactory"
import { Shortener } from "./shortener"

const store: Db = DbFactory.getDb()
const shortener = new Shortener(store)
const app: Express = express()
const port = process.env.PORT || 3000

const options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["html", "css", "js", "ico", "jpg", "jpeg", "png"],
  index: ["index.html"],
  maxAge: "1h",
  redirect: false,
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("dist", options))

app.post("/shorten", async (req, res) => {
  console.log(`post request`, req.body)
  const key = await shortener.shorten(req.body.input)
  console.log(key)
  res.json(key).end()
})

app.get("/replay/:key", async (req, res) => {
  console.log(`request ${JSON.stringify(req.params)}`)
  const key = req.params.key
  const item = await shortener.replay(key)
  res.json(item).end()
})

app.post("/break/:key", async (req, res) => {
  console.log(`post request`, req.body)
  const col = "break"
  const key = req.params.key
  const item = await store.set(col, key, req.body)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

app.delete("/break/:key", async (req, res) => {
  console.log(`request ${JSON.stringify(req.params)}`)
  const col = "break"
  const key = req.params.key
  const item = await store.delete(col, key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

app.get("/break/:key", async (req, res) => {
  console.log(`request ${JSON.stringify(req.params)}`)
  const col = "break"
  const key = req.params.key
  const item = await store.get(col, key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

app.get("/break", async (req, res) => {
  console.log(`request ${JSON.stringify(req.params)}`)
  const col = "break"
  const items = await store.list(col)
  console.log(JSON.stringify(items, null, 2))
  res.json(items).end()
})

app.use("*", (req, res) => {
  res.json({ msg: "no route handler found" }).end()
})

// Start the server
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/index.html`)
})
