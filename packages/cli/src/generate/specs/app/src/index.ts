import 'source-map-support/register';

// std
import * as http from 'http';

// 3p
import { Config, createApp, displayServerURL } from '@foal/core';

// App
import { AppController } from './app/app.controller';

async function main() {
  const app = await createApp(AppController);

  const httpServer = http.createServer(app);
  const port = Config.get('port', 'number', 3001);
  httpServer.listen(port, () => displayServerURL(port));
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); });
