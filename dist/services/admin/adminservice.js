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
            const col = req.params.col;
            const key = req.params.key;
            const item = this.validate(req.params.auth)
                ? yield this.store.delete(col, key)
                : false;
            res.json(item).end();
        }));
        this.app.get("/admin/list/:auth/:col", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const col = req.params.col;
            const item = this.validate(req.params.auth)
                ? yield this.store.list(col)
                : [];
            res.json(item).end();
        }));
    }
    validate(id) {
        return (AdminService.uuid === crypto_1.default.createHash("sha1").update(id).digest("hex"));
    }
}
exports.AdminService = AdminService;
AdminService.uuid = "d41686e6bd4348519fafc3b040bf6827842b271b";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2FkbWluL2FkbWluc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBOEM7QUFFOUMsb0RBQTJCO0FBRTNCLE1BQWEsWUFBWTtJQUt2QixZQUFZLEdBQVk7UUFKZixVQUFLLEdBQU8scUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUtwQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtJQUNoQixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLCtCQUErQixFQUFFLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ2xFLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFBO1lBQzFCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFBO1lBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ3pDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7Z0JBQ25DLENBQUMsQ0FBQyxLQUFLLENBQUE7WUFDVCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4RCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQTtZQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUN6QyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQzVCLENBQUMsQ0FBQyxFQUFFLENBQUE7WUFDTixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQVU7UUFDakIsT0FBTyxDQUNMLFlBQVksQ0FBQyxJQUFJLEtBQUssZ0JBQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FDekUsQ0FBQTtJQUNILENBQUM7O0FBaENILG9DQWlDQztBQTlCUSxpQkFBSSxHQUFHLDBDQUEwQyxBQUE3QyxDQUE2QyJ9