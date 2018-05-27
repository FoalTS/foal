import 'source-map-support/register';

import { App, foal } from '@foal/core';
import * as http from 'http';

import { AppModule } from './app/app.module';

const app = foal(new App(AppModule));

const httpServer = http.createServer(app);
httpServer.listen(3000, () => console.log('Listening on port 3000'));

// module.exports.handler = serverless(app);
