import express, { Express } from "express"
import cors from "cors"
import { ShortenService } from "./services/shortener/shortenservice"
import { AdminService } from "./services/admin/adminservice"

const corsOptions = {
  origin: [
    "https://tailuge.github.io",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
  ],
}

console.log("starting express")

const app: Express = express()
const port = process.env.PORT || 3000
const delexp = /admin.[^/]*.[^/]*/gi

const options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["html", "css", "js", "ico", "jpg", "jpeg", "png"],
  index: ["index.html"],
  maxAge: "1h",
  redirect: false,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("dist", options))
app.use((req, _, next) => {
  console.log(
    req.originalUrl.toString().replace(delexp, "..."),
    req.params,
    req.body
  )
  next()
})

const shortenService = new ShortenService(app)
shortenService.register()
const adminService = new AdminService(app)
adminService.register()

app.use("*", (_, res) => {
  res.json({ msg: "no route handler found" }).end()
})

const server = app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/index.html`)
})

export default server
