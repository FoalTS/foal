---
title: ExpressJS
---

FoalTS applications are created with the `createApp` function in the `src/index.ts` file. This function takes the root controller class (known as `AppController`) as parameter.

```typescript
import { createApp } from '@foal/core';

const app = createApp(AppController);
```

The returned value is an ExpressJS application that can be used as is to create an HTTP server. **FoalTS is not designed to integrate Express middlewares in its controllers or hooks**. However, if for any reason you need to apply globally a middleware to the application, you have two ways to do it.

## Custom Express Instance

You can provide your own express instance to `createApp`.

```typescript
import { createApp } from '@foal/core';
import * as express from 'express';

const expressApp = express();
expressApp.use(/* an Express middleware */)

const app = createApp(AppController, expressApp);
// OR
const app = createApp(AppController, {
  expressInstance: expressApp
});

```

## Pre and Post Express Middlewares

You can also pass global Express middlewares as options to the `createApp` function.

```typescript
import { createApp } from '@foal/core';
import * as rateLimit from 'express-rate-limit';

const app = createApp(AppController, {
  preMiddlewares: [
    /* Express middlewares */
  ],
  postMiddlewares: [
    /* Express middlewares */
  ]
});
```

Pre-middlewares are executed before Foal's controllers and hooks. Post-middlewares are executed only if there was no controller to handle the request, but before the 500 or 404 handlers get called.

## Migrating from Express to FoalTS

In case your are migrating your ExpressJS application to FoalTS, you can access FoalTS service manager using `app.foal.services`.

```typescript
import { createApp } from '@foal/core';

const app = createApp(AppController);
app.foal.services.get(MyServiceClass).doSomething();
```
