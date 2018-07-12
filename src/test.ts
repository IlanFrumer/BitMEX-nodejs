import { resolve } from 'path';
import { BitmexAPI } from '.';

const config = require(resolve(__dirname, '../config.json'));

// tslint:disable:no-console
async function run () {
    const bitmex = new BitmexAPI(config);
    try {
        const filter = JSON.stringify({'execType': ['Settlement', 'Trade']});
        const executions = await bitmex.Execution.getTradeHistory({ filter });

        for (const exec of executions.filter(e => e.ordStatus = 'Filled')) {
            console.log(exec.orderID);
        }

        const chatMessage = await bitmex.Chat.new({ message: 'pump incoming' });
        console.log(chatMessage);
    } catch (e) {
        console.log(e);
    }
}

run();
