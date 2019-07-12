# Limit Requests

To prevent brute force attacks or overloads on your application, you need to implement a rate limiter to limit the number of requests a user is able to send to your application.

In FoalTS you can implement a rate limiter like the [express-rate-limit](https://github.com/nfriedly/express-rate-limit) package by creating a customized `express` object and passing it as a parameter to the FoalTS `createApp` function.

```typescript
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';

import { createApp } from '@foal/core'

const expressApp = express();
expressApp.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

const app = createApp(AppController, expressApp); // For v1
// For v0.8
// const app = createApp(AppController, { /* ... */ }, expressApp);
```
