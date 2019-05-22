"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx_1 = require("rxjs/Rx");
const BitmexTableError_1 = require("./BitmexTableError");
const DEFAULT_MAX_TABLE_LENGTH = 1000;
class BitmexTable extends Rx_1.Observable {
    constructor(observable, options) {
        super((subscriber) => {
            const subs = this.data$.subscribe(d => subscriber.next(d));
            return () => subs.unsubscribe();
        });
        this.observable = observable;
        this.options = options;
        this.data = [];
        this.keys = [];
        this.data$ = this.observable
            .do((data) => this.on(data))
            .map(() => this.data)
            .share();
    }
    on(message) {
        switch (message.action) {
            case 'partial':
                this.keys = message.keys;
                this.data = message.data;
                break;
            case 'insert':
                this.data = this.data.concat(message.data);
                break;
            case 'update':
                if (this.keys.length === 0) {
                    throw new BitmexTableError_1.BitmexTableError(message.table, message.action);
                }
                for (const item of message.data) {
                    const idx = this.data.findIndex((d) => this.keys.every(k => d[k] === item[k]));
                    if (idx >= 0) {
                        this.data[idx] = Object.assign(this.data[idx], item);
                    }
                    else {
                        // ERROR
                    }
                }
                break;
            case 'delete':
                if (this.keys.length === 0) {
                    throw new BitmexTableError_1.BitmexTableError(message.table, message.action);
                }
                for (const item of message.data) {
                    const idx = this.data.findIndex((d) => this.keys.every(k => d[k] === item[k]));
                    if (idx >= 0) {
                        this.data.splice(idx, 1);
                    }
                    else {
                        // ERROR
                    }
                }
                break;
            default:
                return;
        }
        // Limit table size
        const diff = this.data.length - (this.options.maxTableLength || DEFAULT_MAX_TABLE_LENGTH);
        if (diff > 0) {
            this.data.splice(0, diff);
        }
    }
}
exports.BitmexTable = BitmexTable;
