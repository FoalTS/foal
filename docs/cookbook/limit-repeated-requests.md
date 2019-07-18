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
