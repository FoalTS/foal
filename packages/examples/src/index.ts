/**
 * FoalTS
 * Copyright(c) 2017-2019 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

import 'source-map-support/register';

// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import { createConnection } from 'typeorm';

// App
import { AppController } from './app/app.controller';

async function main() {
  await createConnection();

  const app = createApp(AppController);

  const httpServer = http.createServer(app);
  const port = Config.get('port', 3001);
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

main();
