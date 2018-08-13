import 'source-map-support/register';

import * as http from 'http';

import { Config, createApp } from '@foal/core';
import * as sqliteStoreFactory from 'connect-sqlite3';

import { AppModule } from './app/app.module';

const app = createApp(AppModule, {
  store: session => new (sqliteStoreFactory(session))({ db: 'test_db.sqlite' }),
});

const httpServer = http.createServer(app);
httpServer.listen(Config.get('settings', 'port', 3000), () => console.log('Listening...'));

// module.exports.handler = serverless(app);
