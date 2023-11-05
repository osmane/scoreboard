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
const dynamodb_1 = __importDefault(require("@cyclic.sh/dynamodb"));
const util_1 = require("./util");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const opts = {};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
var options = {
    dotfiles: "ignore",
    etag: false,
    extensions: ["htm", "html", "css", "js", "ico", "jpg", "jpeg", "png", "svg"],
    index: ["index.html"],
    maxAge: "1m",
    redirect: false,
};
app.use(express_1.default.static("dist", options));
// Create or Update an item
app.post("/:col/:key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const col = req.params.col;
    const key = req.params.key;
    console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`);
    const item = yield dynamodb_1.default.collection(col).set(key, req.body, opts);
    console.log(JSON.stringify(item, null, 2));
    res.json(item).end();
}));
// Delete an item
app.delete("/break/:key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const col = "break";
    const key = req.params.key;
    console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`);
    const item = yield dynamodb_1.default.collection(col).delete(key, opts, opts);
    console.log(JSON.stringify(item, null, 2));
    res.json(item).end();
}));
// Get a single item
app.get("/break/:key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const col = "break";
    const key = req.params.key;
    console.log(`from collection: ${col} get key: ${key} with params ${JSON.stringify(req.params)}`);
    const item = yield dynamodb_1.default.collection(col).get(key);
    console.log(JSON.stringify(item, null, 2));
    res.json(item).end();
}));
// Get a full listing
app.get("/break", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const col = "break";
    console.log(`list collection: ${col} with params: ${JSON.stringify(req.params)}`);
    const items = yield dynamodb_1.default.collection(col).list();
    console.log(JSON.stringify(items, null, 2));
    res.json(items).end();
}));
app.get("/help", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, util_1.help)();
    res.json([]).end();
}));
// Catch all handler for all other request.
app.use("*", (req, res) => {
    res.json({ msg: "no route handler found" }).end();
});
// Start the server
app.listen(port, () => {
    console.log(`listening on http://localhost:${port}/index.html`);
});
