/**
 * FoalTS
 * Copyright(c) 2017-2020 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

import 'source-map-support/register';

// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import { createConnection } from '@foal/typeorm/node_modules/typeorm';

// App
import { AppController } from './app/app.controller';

async function main() {
  await createConnection(require('../ormconfig.json'));

  const app = createApp(AppController);

  const httpServer = http.createServer(app);
  const port = Config.get2('port', 'number', 3001);
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

main()
  .catch(err => { console.error(err); process.exit(1); });
