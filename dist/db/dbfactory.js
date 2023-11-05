"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbFactory = void 0;
const cyclicdb_1 = require("./cyclicdb");
const localdb_1 = require("./localdb");
class DbFactory {
    static getDb() {
        if (process.env.CYCLIC_DB) {
            console.log("Cyclic DB");
            return new cyclicdb_1.CyclicDb();
        }
        console.log("Local DB");
        return new localdb_1.LocalDb();
    }
}
exports.DbFactory = DbFactory;
