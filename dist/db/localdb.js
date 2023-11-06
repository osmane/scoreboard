"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalDb = void 0;
class LocalDb {
    constructor() {
        this.store = new Map();
    }
    set(collection, key, props) {
        this.store.set(key, props);
        return new Promise((res, rej) => {
            res({ collection: collection, key: key, props: props });
            return;
        });
    }
    list(collection) {
        const result = [];
        this.store.forEach((value, key) => {
            result.push({ collection: collection, key: key, props: value });
        });
        return new Promise((res, rej) => {
            res(result);
            return;
        });
    }
}
exports.LocalDb = LocalDb;
