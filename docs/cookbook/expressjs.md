# ExpressJS

FoalTS applications are created with the `createApp` function in the `src/index.ts` file. This function takes the root controller class (known as `AppController`) as parameter.

```typescript
import { createApp } from '@foal/core';

const app = createApp(AppController);
```

The returned value is an ExpressJS application that can be used as is to create an HTTP server. *FoalTS is not designed to integrate Express middlewares in its controllers*. However, if for any reason you need to apply globally a middleware to the application, you can provide your own express instance to `createApp`.

```typescript
import { createApp } from '@foal/core';
import * as express from 'express';

const expressApp = express();
expressApp.use(/* an Express middleware */)
const app = createApp(AppController, expressApp);
```