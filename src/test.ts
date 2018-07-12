import { BitmexAPI } from "./BitmexAPI";
import { resolve } from 'path';

const config = require(resolve(__dirname, '../config.json'));

async function run () {
    const bitmex = new BitmexAPI(config);
    try {
        const orders = await bitmex.Leaderboard.get({ method: 'ROE' })
        
        console.log(orders);
        // for (const order of orders) {
        //     console.log(order.)
        // }
        
    } catch(e) {
        console.log(e);
    }
    // console.log(chat);
}

run();