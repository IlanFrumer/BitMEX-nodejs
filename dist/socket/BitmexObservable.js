"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitmexObservable = void 0;
const rxjs_1 = require("rxjs");
const BitmexTable_1 = require("./BitmexTable");
class BitmexObservable extends rxjs_1.Observable {
    toTable(options = {}) {
        return new BitmexTable_1.BitmexTable(this, options);
    }
}
exports.BitmexObservable = BitmexObservable;
