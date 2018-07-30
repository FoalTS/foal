import 'source-map-support/register';

import * as http from 'http';

import { Config, createApp } from '@foal/core';

import { AppModule } from './app/app.module';

const app = createApp(AppModule);

const httpServer = http.createServer(app);
const port = Config.get('settings', 'port', 3000);
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// module.exports.handler = serverless(app);
