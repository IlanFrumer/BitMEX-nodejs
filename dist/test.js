"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const _1 = require(".");
const config = require(path_1.resolve(__dirname, '../config.json'));
// tslint:disable:no-console
function run() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const bitmex = new _1.BitmexAPI(config);
        try {
            const filter = JSON.stringify({ 'execType': ['Settlement', 'Trade'] });
            const executions = yield bitmex.Execution.getTradeHistory({ filter });
            for (const exec of executions.filter(e => e.ordStatus = 'Filled')) {
                console.log(exec.orderID);
            }
            const chatMessage = yield bitmex.Chat.new({ message: 'pump incoming' });
            console.log(chatMessage);
        }
        catch (e) {
            console.log(e);
        }
    });
}
run();
