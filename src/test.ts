import { BitmexAPI } from "./BitmexAPI";
import { resolve } from 'path';

const config = require(resolve(__dirname, '../config.json'));

async function run () {
    const bitmex = new BitmexAPI(config);
    try {
        const user = await bitmex.User.get();
        console.log(user);
    } catch(e) {
        console.log(e);
    }

run();