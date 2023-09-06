---
title: ExpressJS
---

FoalTS applications are created with the `createApp` function in the `src/index.ts` file. This function takes the root controller class (known as `AppController`) as parameter.

```typescript
import { createApp } from '@foal/core';

const app = await createApp(AppController);
```

The returned value is an ExpressJS application that can be used as is to create an HTTP server. **FoalTS is not designed to integrate Express middlewares in its controllers or hooks**. However, if for any reason you need to apply globally a middleware to the application, you have two ways to do it.

## Custom Express Instance

You can provide your own express instance to `createApp`.

```typescript
import { createApp } from '@foal/core';
import * as express from 'express';

const expressApp = express();
expressApp.use(/* an Express middleware */)

const app = await createApp(AppController, {
  expressInstance: expressApp
});

```

## Pre and Post Express Middlewares

You can also pass global Express middlewares as options to the `createApp` function.

```typescript
import { createApp } from '@foal/core';
import * as rateLimit from 'express-rate-limit';

const app = await createApp(AppController, {
  preMiddlewares: [
    /* Express middlewares */
  ],
  postMiddlewares: [
    /* Express middlewares */
  ]
});
```

Pre-middlewares are executed before Foal's controllers and hooks and before the internal Express middlewares of the framework. Post-middlewares are executed only if there was no controller to handle the request, but before the 500 or 404 handlers get called.

> In the rare case that you need to run middleware after Foal's internal Express middlewares, you can also use the `afterPreMiddlewares` option for this.

## Migrating from Express to FoalTS

### Integrating Foal with an existing Express application

In your `tsconfig.json`, set the following two options to `true`.

```json
{
  "compilerOptions": {
    // ...
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
  }
}
```

Then, in your existing code, create the FoalTS application and use it as if it were a simple Express router.

```typescript
const app = await createApp(AppController);

const expressApp = express();
expressApp.use('/api', app);
expressApp.listen(3000, () => console.log('Listening on port 3000...'));
```

### Calling services from outside the Foal application

In case your are migrating your ExpressJS application to FoalTS, you can also access FoalTS service manager using `app.foal.services`.

```typescript
import { createApp } from '@foal/core';

const app = await createApp(AppController);
app.foal.services.get(MyServiceClass).doSomething();
```
