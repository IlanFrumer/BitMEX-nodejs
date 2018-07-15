"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BitmexTableError extends Error {
    constructor(table, action) {
        super(`The data in the store ${table} is not keyed for ${action} 's.Please email support@bitmex.com if you see this.`);
    }
}
exports.BitmexTableError = BitmexTableError;
