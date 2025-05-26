---
title: Rate Limiting
---

To avoid brute force attacks or overloading your application, you can set up a rate limiter to limit the number of requests a user can send to your application.

## Basic Example

Foal does not provide a built-in utility for this, but you can use the [express-rate-limit](https://github.com/nfriedly/express-rate-limit) package to handle it.

```
npm install express-rate-limit
```

*src/index.ts*
```typescript
// 3p
import { Config, createApp, Logger, ServiceManager } from '@foal/core';
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';

// App
import { AppController } from './app/app.controller';

async function main() {
  const expressApp = express();
  expressApp.use(rateLimit({
    // Limit each IP to 100 requests per windowMs
    max: 100,
    // 15 minutes
    windowMs: 15 * 60 * 1000,
    handler (req, res, next) {
      // Set default FoalTS headers to the response of limited requests
      res.removeHeader('X-Powered-By');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      
      // Send the response with the default statusCode and message from rateLimit
      res.status(this.statusCode || 429).send(this.message);
    }
  }));

  const serviceManager = new ServiceManager();
  const logger = serviceManager.get(Logger);
    
  const app = await createApp(AppController, { expressInstance: expressApp });

  const port = Config.get('port', 'number', 3001);
  app.listen(port, () => logger.info(`Listening on port ${port}...`));
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); });
```


## Usage with CORS

In case your application needs to allow CORS requests, you can also update your `index.ts` as follows.

```typescript
expressApp.use(rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  handler (req, res, next) {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      // You may want to allow other headers depending on what you need (Authorization, etc).
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
    }

    res.status(this.statusCode || 429).send(this.message);
  }
}));
```
