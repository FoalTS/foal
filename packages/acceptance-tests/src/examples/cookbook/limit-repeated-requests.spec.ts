// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';

it('[Docs] Cookbook > Limit Repeated Requests', () => {
  class AppController {}

  // Only test compilation
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
});
