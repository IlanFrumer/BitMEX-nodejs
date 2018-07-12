# BitMEX-nodejs

## Installation

`npm install bitmex-node`

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

