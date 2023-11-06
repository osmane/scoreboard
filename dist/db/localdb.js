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
exports.LocalDb = void 0;
class LocalDb {
    constructor() {
        this.store = new Map();
    }
    delete(collection, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, _) => {
                res(this.store.delete(key));
                return;
            });
        });
    }
    get(collection, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, _) => {
                res(this.store.get(key));
                return;
            });
        });
    }
    set(collection, key, props) {
        return __awaiter(this, void 0, void 0, function* () {
            this.store.set(key, props);
            return new Promise((res, _) => {
                res({ collection: collection, key: key, props: props });
                return;
            });
        });
    }
    list(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            this.store.forEach((value, key) => {
                result.push({ collection: collection, key: key, props: value });
            });
            return new Promise((res, _) => {
                res(result);
                return;
            });
        });
    }
}
exports.LocalDb = LocalDb;
