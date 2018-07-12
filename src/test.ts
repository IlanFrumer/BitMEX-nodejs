import { BitmexAPI } from "./BitmexAPI";
import { resolve } from 'path';

const config = require(resolve(__dirname, '../config.json'));

async function run () {
    const bitmex = new BitmexAPI(config);
    try {
        const bucket = await bitmex.Trade.getBucketed({ binSize: '1m' })
        for (const b of bucket) {
            console.log(b)
        }
    } catch(e) {
        console.log(e);
    }
}

run();