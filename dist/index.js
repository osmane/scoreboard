"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbfactory_1 = require("./db/dbfactory");
const shortener_1 = require("./shortener");
const store = dbfactory_1.DbFactory.getDb();
const shortener = new shortener_1.Shortener(store);
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const options = {
    dotfiles: "ignore",
    etag: false,
    extensions: ["html", "css", "js", "ico", "jpg", "jpeg", "png"],
    index: ["index.html"],
    maxAge: "1h",
    redirect: false,
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("dist", options));
app.post("/shorten", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`post request`, req.body);
    const key = yield shortener.shorten(req.body.input);
    console.log(key);
    res.json(key).end();
}));
app.get("/replay/:key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`request ${JSON.stringify(req.params)}`);
    const key = req.params.key;
    const item = yield shortener.replay(key);
    res.json(item).end();
}));
app.post("/break/:key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`post request`, req.body);
    const col = "break";
    const key = req.params.key;
    const item = yield store.set(col, key, req.body);
    console.log(JSON.stringify(item, null, 2));
    res.json(item).end();
}));
app.delete("/break/:key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`request ${JSON.stringify(req.params)}`);
    const col = "break";
    const key = req.params.key;
    const item = yield store.delete(col, key);
    console.log(JSON.stringify(item, null, 2));
    res.json(item).end();
}));
app.get("/break/:key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`request ${JSON.stringify(req.params)}`);
    const col = "break";
    const key = req.params.key;
    const item = yield store.get(col, key);
    console.log(JSON.stringify(item, null, 2));
    res.json(item).end();
}));
app.get("/break", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`request ${JSON.stringify(req.params)}`);
    const col = "break";
    const items = yield store.list(col);
    console.log(JSON.stringify(items, null, 2));
    res.json(items).end();
}));
app.use("*", (req, res) => {
    res.json({ msg: "no route handler found" }).end();
});
// Start the server
app.listen(port, () => {
    console.log(`listening on http://localhost:${port}/index.html`);
});
