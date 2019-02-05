import 'source-map-support/register';

// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import * as mongodbStoreFactory from 'connect-mongo';
import { createConnection } from 'mongoose';

// App
import { AppController } from './app/app.controller';

async function main() {
  const mongooseConnection = createConnection('mongodb://localhost:27017/test-foo-bar-db');

  const app = createApp(AppController, {
    store: session => new (mongodbStoreFactory(session))({ mongooseConnection })
  });

  const httpServer = http.createServer(app);
  const port = Config.get('settings', 'port', 3000);
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

main();
