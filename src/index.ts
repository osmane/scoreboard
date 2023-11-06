import express, { Express } from "express"
import { DbFactory } from "./db/dbfactory"
import { Shortener } from "./shortener"

console.log("starting express")

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
app.use((req: any, _: any, next: any) => {
  console.log(req.originalUrl, req.params, req.body)
  next()
})

app.post("/shorten", async (req, res) => {
  const key = await shortener.shorten({ input: req.body.input })
  const response = {
    input: req.body.input,
    key: key,
    shortUrl: await shortener.replay(key),
  }
  res.json(response).end()
})

app.get("/replay/:key", async (req, res) => {
  res.redirect(await shortener.replay(req.params.key))
})

app.post("/break/:key", async (req, res) => {
  const col = "break"
  const key = req.params.key
  const item = await store.set(col, key, req.body)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

app.delete("/break/:key", async (req, res) => {
  const col = "break"
  const key = req.params.key
  const item = await store.delete(col, key)
  res.json(item).end()
})

app.get("/break/:key", async (req, res) => {
  const col = "break"
  const key = req.params.key
  const item = await store.get(col, key)
  res.json(item).end()
})

app.get("/break", async (_, res) => {
  const col = "break"
  const items = await store.list(col)
  res.json(items).end()
})

app.use("*", (_, res) => {
  res.json({ msg: "no route handler found" }).end()
})

// Start the server
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/index.html`)
})
