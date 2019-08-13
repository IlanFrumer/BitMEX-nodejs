### BitMEX-nodejs - An unofficial BitMEX API connector written with typescript

*All types and methods are automatically generated from BitMEX official Swagger Specification*

#### Installation  

  - CLI installation: `npm install bitmex-node`
  - Create API keys: https://www.bitmex.com/app/apiKeys
  - Recommended code editor: [Visual studio code](https://code.visualstudio.com/)

#### Live Example

![visual studio code - bitmex node](https://user-images.githubusercontent.com/3116399/42608773-033cc7ec-8592-11e8-93aa-31ae365072bc.gif)

####  Code Example

```typescript

import { BitmexAPI } from "bitmex-node";

const bitmex = new BitmexAPI({
    "apiKeyID": "NXTy391NCdhrrSWzsJE_xktb",
    "apiKeySecret": "bPVQ51-xxI7bRcuAAOlvH0wUFpPvusfmC1dF6zyy4s3v8Mgd",
    // "proxy": "https://cors-anywhere.herokuapp.com/"
);

!async function () {

    const chatMessage = await bitmex.Chat.new({ message: 'Pump incoming !!! ' });

}()

```

#### Features:

- [BitMEX API Explorer](https://www.bitmex.com/api/explorer/#/)
- [Authentication](https://www.bitmex.com/app/apiKeysUsage)
- [Native promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Rate limiting](https://www.bitmex.com/app/restAPI#Request-Rate-Limits)

###### Donate
 - (BTC) 1CUjz7EF1iqgJPi3MPW6Nb556tQwPNryM3
