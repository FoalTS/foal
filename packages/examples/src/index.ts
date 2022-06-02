/**
 * FoalTS
 * Copyright(c) 2017-2022 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

import 'source-map-support/register';

// std
import * as http from 'http';

// 3p
import { Config, createApp, displayServerURL, ServiceManager } from '@foal/core';
import { DataSource } from '@foal/typeorm/node_modules/typeorm';

// App
import { AppController } from './app/app.controller';

async function main() {
  const dataSource = new DataSource(require('../ormconfig.json'));
  await dataSource.initialize();

  const serviceManager = new ServiceManager()
    .set('TYPEORM_DATA_SOURCE', dataSource);

  const app = await createApp(AppController, { serviceManager });

  const httpServer = http.createServer(app);
  const port = Config.get('port', 'number', 3001);
  httpServer.listen(port, () => displayServerURL(port));
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); });
