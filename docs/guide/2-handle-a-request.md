# 2. Handle you first request

Create file

Few words about context.

Return a content with a 200 status. (Note may return as well a promise).

```typescript
import { Handler, HttpResponseOK } from '@foal/core';

export const getAirport: Handler = ctx => {
  return new HttpResponseOK({ name: 'JFK' });
};

```

Now connect the handler to a URL.

```typescript
import { Module } from '@foal/core';

import { getAirport } from './handlers/get-airport';

export const AppModule: Module = {
  controllers: [
    route('GET', '/airport', getAirport),
  ],
};

```