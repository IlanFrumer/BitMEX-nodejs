"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitmexObservable = void 0;
const Rx_1 = require("rxjs/Rx");
const BitmexTable_1 = require("./BitmexTable");
class BitmexObservable extends Rx_1.Observable {
    toTable(options = {}) {
        return new BitmexTable_1.BitmexTable(this, options);
    }
}
exports.BitmexObservable = BitmexObservable;
