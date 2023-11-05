import express, { Express } from "express"
import db from "@cyclic.sh/dynamodb"
import { help } from "./util"

const app: Express = express()
const port = process.env.PORT || 3000
const opts = {}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html", "css", "js", "ico", "jpg", "jpeg", "png", "svg"],
  index: ["index.html"],
  maxAge: "1m",
  redirect: false,
}
app.use(express.static("dist", options))

// Create or Update an item
app.post("/:col/:key", async (req, res) => {
  console.log(req.body)

  const col = req.params.col
  const key = req.params.key
  console.log(
    `from collection: ${col} delete key: ${key} with params ${JSON.stringify(
      req.params
    )}`
  )
  const item = await db.collection(col).set(key, req.body, opts)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Delete an item
app.delete("/break/:key", async (req, res) => {
  const col = "break"
  const key = req.params.key
  console.log(
    `from collection: ${col} delete key: ${key} with params ${JSON.stringify(
      req.params
    )}`
  )
  const item = await db.collection(col).delete(key, opts, opts)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a single item
app.get("/break/:key", async (req, res) => {
  const col = "break"
  const key = req.params.key
  console.log(
    `from collection: ${col} get key: ${key} with params ${JSON.stringify(
      req.params
    )}`
  )
  const item = await db.collection(col).get(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a full listing
app.get("/break", async (req, res) => {
  const col = "break"
  console.log(
    `list collection: ${col} with params: ${JSON.stringify(req.params)}`
  )
  const items = await db.collection(col).list()
  console.log(JSON.stringify(items, null, 2))
  res.json(items).end()
})

app.get("/help", async (req, res) => {
  help()
  res.json([]).end()
})

// Catch all handler for all other request.
app.use("*", (req, res) => {
  res.json({ msg: "no route handler found" }).end()
})

// Start the server
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/index.html`)
})
