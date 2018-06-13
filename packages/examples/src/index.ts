import 'source-map-support/register';

import { Config, createApp } from '@foal/core';
import * as http from 'http';

import { AppModule } from './app/app.module';

const app = createApp(AppModule);

const httpServer = http.createServer(app);
httpServer.listen(Config.get('settings', 'port', 3000), () => console.log('Listening...'));

// module.exports.handler = serverless(app);
