# BitMEX-nodejs - BitMEX API connector written with typescript

## Installation

`npm install bitmex-node`

## Live Example

![visual studio code - bitmex node](https://user-images.githubusercontent.com/3116399/42608773-033cc7ec-8592-11e8-93aa-31ae365072bc.gif)

##  Code Example

```typescript

import { BitmexAPI } from "bitmex-node";

const bitmex = new BitmexAPI({
    // https://www.bitmex.com/app/apiKeys
    "apiKeyID": "NXTy391NCdhrrSWzsJE_xktb",
    "apiKeySecret": "bPVQ51-xxI7bRcuAAOlvH0wUFpPvusfmC1dF6zyy4s3v8Mgd"
);

!async function () {

    const chatMessage = await bitmex.Chat.new({ message: 'Pump incoming !!! ' });

}()

```

## Features:

- Automatically generates a typed API from [BitMEX API Explorer](https://www.bitmex.com/api/explorer/#/)
- [Authentication](https://www.bitmex.com/app/apiKeysUsage)
- [Native promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Rate limiting](https://www.bitmex.com/app/restAPI#Request-Rate-Limits)
