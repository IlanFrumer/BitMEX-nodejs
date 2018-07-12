"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BitmexAPI_1 = require("./BitmexAPI");
const path_1 = require("path");
const config = require(path_1.resolve(__dirname, '../config.json'));
function run() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const bitmex = new BitmexAPI_1.BitmexAPI(config);
        try {
            const orders = yield bitmex.Leaderboard.get({ method: 'ROE' });
            console.log(orders);
            // for (const order of orders) {
            //     console.log(order.)
            // }
        }
        catch (e) {
            console.log(e);
        }
        // console.log(chat);
    });
}
run();
