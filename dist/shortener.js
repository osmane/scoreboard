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
            console.log(key, "here", data);
            yield this.store.set(this.collection, key, data);
            return key;
        });
    }
    replay(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = yield this.store.get(this.collection, key);
            console.log(params);
            return params === null || params === void 0 ? void 0 : params.props;
        });
    }
}
exports.Shortener = Shortener;
