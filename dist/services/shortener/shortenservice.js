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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortenService = void 0;
const dbfactory_1 = require("../../db/dbfactory");
const shortener_1 = require("./shortener");
class ShortenService {
    constructor(app) {
        this.store = dbfactory_1.DbFactory.getDb();
        this.app = app;
        this.shortener = new shortener_1.Shortener(this.store);
    }
    register() {
        this.app.post("/shorten", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.json(yield this.shortener.shorten({ input: req.body.input })).end();
        }));
        this.app.get("/replay/:key", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.redirect(yield this.shortener.replay(req.params.key));
        }));
    }
}
exports.ShortenService = ShortenService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcnRlbnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc2hvcnRlbmVyL3Nob3J0ZW5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLGtEQUE4QztBQUU5QywyQ0FBdUM7QUFDdkMsTUFBYSxjQUFjO0lBS3pCLFlBQVksR0FBWTtRQUpmLFVBQUssR0FBTyxxQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBS3BDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUN6RSxDQUFDLENBQUEsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzlDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDM0QsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQW5CRCx3Q0FtQkMifQ==