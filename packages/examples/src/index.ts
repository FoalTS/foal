import 'source-map-support/register';

import { createApp, getConfig } from '@foal/core';
import * as http from 'http';

import { AppModule } from './app/app.module';

const app = createApp(AppModule);

const httpServer = http.createServer(app);
httpServer.listen(getConfig('base').port || 3000, () => console.log('Listening...'));

// module.exports.handler = serverless(app);
