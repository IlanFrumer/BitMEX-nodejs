"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_MAX_TABLE_LENGTH = 1000;
class BitmexTableError extends Error {
    constructor(table, action) {
        super(`The data in the store ${table} is not keyed for ${action} 's.Please email support@bitmex.com if you see this.`);
    }
}
class BitmexTable {
    constructor(observable, options) {
        this.options = options;
        this.data = [];
        this.keys = [];
        this.subscription = observable.subscribe(data => this.on(data));
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
                    throw new BitmexTableError(message.table, message.action);
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
                    throw new BitmexTableError(message.table, message.action);
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
        }
        // Limit table size
        const diff = this.data.length - (this.options.maxTableLength || DEFAULT_MAX_TABLE_LENGTH);
        if (diff > 0) {
            this.data.splice(0, diff);
        }
        console.log(message.table, this.data.length);
    }
}
exports.BitmexTable = BitmexTable;
