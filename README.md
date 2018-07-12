# BitMEX-nodejs

## Installation

`npm install bitmex-node`

## Live Example

![visual studio code - bitmex node](https://user-images.githubusercontent.com/3116399/42608773-033cc7ec-8592-11e8-93aa-31ae365072bc.gif)

## BitMEX API connector written with typescript

```typescript

import { BitmexAPI } from "bitmex-node";

const bitmex = new BitmexAPI({
    "apiKeyID": "NXTyXXXXXXXXXXXXXXXXXXXX",
    "apiKeySecret": "bPVQ51-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
});


bitmex.User.get()
```

## Features:

- Promises
- Rate limit
- more ...
