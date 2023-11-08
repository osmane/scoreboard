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
exports.Shortener = void 0;
class Shortener {
    constructor(store) {
        this.collection = "short";
        this.replayUrl = "https://tailuge.github.io/billiards/dist/";
        this.shortUrl = "https://tailuge-billiards.cyclic.app/replay/";
        this.notFound = "https://tailuge-billiards.cyclic.app/notfound.html";
        this.store = store;
    }
    keyFountain() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.store.list(this.collection);
            return (1 +
                items
                    .map((item) => { var _a; return Number.parseInt((_a = item.key) !== null && _a !== void 0 ? _a : "0"); })
                    .reduce((a, b) => Math.max(a, b), 0));
        });
    }
    shorten(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = (yield this.keyFountain()).toString();
            console.log("next free key: ", key);
            yield this.store.set(this.collection, key, data);
            return {
                input: data.input,
                key: key,
                shortUrl: this.shortUrl + key,
            };
        });
    }
    replay(key) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.store.get(this.collection, key);
            if ((item === null || item === void 0 ? void 0 : item.props) && ((_a = item.props) === null || _a === void 0 ? void 0 : _a.input)) {
                return this.replayUrl + item.props.input;
            }
            return this.notFound;
        });
    }
}
exports.Shortener = Shortener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcnRlbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3Nob3J0ZW5lci9zaG9ydGVuZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsTUFBYSxTQUFTO0lBT3BCLFlBQVksS0FBUztRQU5aLGVBQVUsR0FBRyxPQUFPLENBQUE7UUFFcEIsY0FBUyxHQUFHLDJDQUEyQyxDQUFBO1FBQ3ZELGFBQVEsR0FBRyw4Q0FBOEMsQ0FBQTtRQUN6RCxhQUFRLEdBQUcsb0RBQW9ELENBQUE7UUFHdEUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7SUFDcEIsQ0FBQztJQUVLLFdBQVc7O1lBQ2YsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDcEQsT0FBTyxDQUNMLENBQUM7Z0JBQ0QsS0FBSztxQkFDRixHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFDLE9BQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFBLElBQUksQ0FBQyxHQUFHLG1DQUFJLEdBQUcsQ0FBQyxDQUFBLEVBQUEsQ0FBQztxQkFDL0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3ZDLENBQUE7UUFDSCxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsSUFBUzs7WUFDckIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDbkMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUNoRCxPQUFPO2dCQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRzthQUM5QixDQUFBO1FBQ0gsQ0FBQztLQUFBO0lBRUssTUFBTSxDQUFDLEdBQVc7OztZQUN0QixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDdkQsSUFBSSxDQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxLQUFLLE1BQUksTUFBQSxJQUFJLENBQUMsS0FBSywwQ0FBRSxLQUFLLENBQUEsRUFBRTtnQkFDcEMsT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFBO2FBQ3pDO1lBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBOztLQUNyQjtDQUNGO0FBdkNELDhCQXVDQyJ9