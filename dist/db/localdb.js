"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalDb = void 0;
class LocalDb {
    constructor() {
        this.store = new Map();
    }
    list(collection) {
        return new Promise((res, rej) => {
            res(["game1"]);
            return;
        });
    }
}
exports.LocalDb = LocalDb;
