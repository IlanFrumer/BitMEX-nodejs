# BitMEX-nodejs

## BitMEX API connector written with typescript

```typescript

import { BitmexAPI } from "bitmex-node";

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
```

## Features:

- Promises
- Rate limit
- more ...

