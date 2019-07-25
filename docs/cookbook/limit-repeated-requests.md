# Limit Repeated Requests

To prevent brute force attacks or overloads on your application, you need to implement a rate limiter to limit the number of requests a user is able to send to your application.

In FoalTS you can implement a rate limiter like the [express-rate-limit](https://github.com/nfriedly/express-rate-limit) package by creating a customized `express` object and passing it as a parameter to the FoalTS `createApp` function.

*src/index.ts*
```typescript
// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';

// App
import { AppController } from './app/app.controller';

async function main() {
  // Connection to the database(s)...
    
  const expressApp = express();
  expressApp.use(rateLimit({
    max: 100, // limit each IP to 100 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
  }));
    
  const app = createApp(AppController, expressApp); // For v1
  // For v0.8
  // const app = createApp(AppController, { /* ... */ }, expressApp);
    
  const httpServer = http.createServer(app);
  const port = Config.get('port', 3001);
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

main();
```


**Rate limiting with CORS**

If you need CORS headers to be send back in a response, you will need to manually set the headers on the rate limiter response because it does not get handled by FoalTS hooks. If you don't manually set any headers only the default Express.js headers will be set in the response.

> Note: Because the rate limiter response does not get handled by FoalTS, you should also set the default FoalTS headers manually.

```typescript
expressApp.use(rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  handler: function (req, res, next) {
    // Set default FoalTS headers
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send the response with the default statusCode and message from rateLimit
    res.status(this.statusCode).send(this.message);
  }
}));
```

You can find more options for [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) in the [documentation](https://github.com/nfriedly/express-rate-limit).
