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
exports.AdminService = void 0;
const dbfactory_1 = require("../../db/dbfactory");
const crypto_1 = __importDefault(require("crypto"));
class AdminService {
    constructor(app) {
        this.store = dbfactory_1.DbFactory.getDb();
        this.app = app;
    }
    register() {
        this.app.delete("/admin/delete/:auth/:col/:key", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = crypto_1.default.createHash("sha1").update(req.params.auth).digest("hex");
            const col = req.params.col;
            const key = req.params.key;
            const item = id === AdminService.uuid ? yield this.store.delete(col, key) : false;
            res.json(item).end();
        }));
        this.app.get("/admin/list/:auth/:col", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = crypto_1.default.createHash("sha1").update(req.params.auth).digest("hex");
            const col = req.params.col;
            const item = id === AdminService.uuid ? yield this.store.list(col) : [];
            res.json(item).end();
        }));
    }
}
exports.AdminService = AdminService;
AdminService.uuid = "d41686e6bd4348519fafc3b040bf6827842b271b";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FkbWluL2FkbWluc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBOEM7QUFFOUMsb0RBQTJCO0FBRTNCLE1BQWEsWUFBWTtJQUt2QixZQUFZLEdBQVk7UUFKZixVQUFLLEdBQU8scUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUtwQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtJQUNoQixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLCtCQUErQixFQUFFLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ2xFLE1BQU0sRUFBRSxHQUFHLGdCQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMxRSxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQTtZQUMxQixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQTtZQUMxQixNQUFNLElBQUksR0FDUixFQUFFLEtBQUssWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtZQUN0RSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4RCxNQUFNLEVBQUUsR0FBRyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDMUUsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUE7WUFDMUIsTUFBTSxJQUFJLEdBQUcsRUFBRSxLQUFLLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtZQUN2RSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDOztBQXpCSCxvQ0EwQkM7QUF2QlEsaUJBQUksR0FBRywwQ0FBMEMsQUFBN0MsQ0FBNkMifQ==