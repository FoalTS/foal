// 3p
import { Config, createApp, Logger, ServiceManager } from '@foal/core';
import * as express from 'express';
import { rateLimit } from 'express-rate-limit';

it('[Docs] Cookbook > Limit Repeated Requests', () => {
  class AppController {}

  // Only test compilation
  // tslint:disable-next-line
  async function main() {
    const expressApp = express();
    expressApp.use(rateLimit({
      // Limit each IP to 100 requests per windowMs
      max: 100,
      // 15 minutes
      windowMs: 15 * 60 * 1000,
      handler (req: any, res: any, next: () => void) {
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
});
