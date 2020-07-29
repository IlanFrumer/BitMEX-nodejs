### BitMEX-nodejs - An unofficial BitMEX API connector written with TypeScript

*All types and methods are automatically generated from the BitMEX official Swagger Specification*

#### Installation  

  - CLI installation: `npm install bitmex-node`
  - Create API keys: https://www.bitmex.com/app/apiKeys
  - Recommended code editor: [Visual studio code](https://code.visualstudio.com/)

#### Live Example

![visual studio code - bitmex node](https://user-images.githubusercontent.com/3116399/42608773-033cc7ec-8592-11e8-93aa-31ae365072bc.gif)

####  Code Example

```typescript

import { BitmexAPI, BitmexSocket, ITableMessage, Trade } from "bitmex-node";

const bitmexOptions = {
    "apiKeyID": "NXTy391NCdhrrSWzsJE_xktb",
    "apiKeySecret": "bPVQ51-xxI7bRcuAAOlvH0wUFpPvusfmC1dF6zyy4s3v8Mgd",
    // "proxy": "https://cors-anywhere.herokuapp.com/"
};
const bitmex = new BitmexAPI(bitmexOptions);
const bitmexSocket = new BitmexSocket(bitmexOptions);

!async function () {

    const chatMessage = await bitmex.Chat.new({ message: "Pump incoming !!!" });

    bitmexSocket.trade("XBTUSD").subscribe((message: ITableMessage & { data: Trade[] }) => {
      console.log(message.action, message.data);
    });

}()

```

#### REST API

- The methods of this class correspond with the endpoints of the BitMEX API.
  
  For example, `new BitmexAPI().Trade.getBucketed();` corresponds with the `/trade/bucketed/` endpoint.
- By default, this package will wait to send requests when it expects the rate limit to be exceeded. This can be disabled when instantiating `BitmexAPI`.
- It is possible to query the last rate limit headers received with:
  `new BitmexAPI().getRateLimit();`

#### WebSocket API

- This package uses RxJS to allow multiple subscriptions and unsubscriptions to the various channels.
- It is a known issue websockets connected to BitMEX can disconnect unexpectedly.
  - By default, this package will send a `ping` message when a message hasn't been received for a period of time.
  - If a `pong` message is not received, the socket will be closed.
  - The timeframe for `ping` and `pong` messages is configurable when insantiating `BitmexSocket`.
  - A callback can be passed when instantiating `BitmexSocket` to be called when the websocket is closed.

#### Related Documentation:

- [BitMEX API Explorer](https://www.bitmex.com/api/explorer/#/)
- [Authentication](https://www.bitmex.com/app/apiKeysUsage)
- [Native promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Rate limiting](https://www.bitmex.com/app/restAPI#Request-Rate-Limits)
- [RxJS Observables](https://rxjs-dev.firebaseapp.com/guide/observable)

###### Donate
 - (BTC) 1CUjz7EF1iqgJPi3MPW6Nb556tQwPNryM3
