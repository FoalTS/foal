import 'source-map-support/register';

// 3p
import { Config, createApp, displayServerURL } from '@foal/core';

// App
import { AppController } from './app/app.controller';
import { dataSource } from './db';

async function main() {
  await dataSource.initialize();

  const app = await createApp(AppController);

  const port = Config.get('port', 'number', 3001);
  app.listen(port, () => displayServerURL(port));
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); });
