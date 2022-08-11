/**
 * FoalTS
 * Copyright(c) 2017-2022 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

import 'source-map-support/register';

// 3p
import { Config, createApp, displayServerURL } from '@foal/core';
import { createConnection } from '@foal/typeorm/node_modules/typeorm';

// App
import { AppController } from './app/app.controller';

async function main() {
  await createConnection(require('../ormconfig.json'));

  const app = await createApp(AppController);

  const port = Config.get('port', 'number', 3001);
  app.listen(port, () => displayServerURL(port));
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); });
