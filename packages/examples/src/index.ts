import 'source-map-support/register';

import * as http from 'http';

import { foal } from '@foal/platform';

import { App } from '@foal/core';
import { AppModule } from './app/app.module';

const app = foal(new App(AppModule), {
  csrfProtection: false,
  debugMode: true,
  session: { secret: 'my secret', resave: true, saveUninitialized: true },
  staticUrl: 'public/',
});

const httpServer = http.createServer(app);

httpServer.listen(3000, () => console.log('Listening on port 3000'));
