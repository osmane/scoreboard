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
exports.CyclicDb = void 0;
const dynamodb_1 = __importDefault(require("@cyclic.sh/dynamodb"));
class CyclicDb {
    constructor() {
        this.opts = {};
    }
    list(collection) {
        return dynamodb_1.default
            .collection(collection)
            .list()
            .then((i) => {
            return [i.results.values.toString()];
        })
            .catch((_) => {
            return [""];
        });
    }
    set(collection, key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return dynamodb_1.default
                .collection(collection)
                .set(key, value, this.opts)
                .then((_) => {
                return true;
            })
                .catch((_) => {
                return false;
            });
        });
    }
}
exports.CyclicDb = CyclicDb;
