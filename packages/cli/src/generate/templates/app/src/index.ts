import 'source-map-support/register';

// std
import * as http from 'http';

// 3p
import { Config, createApp, displayServerURL, ServiceManager } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

// App
import { AppController } from './app/app.controller';
import { appDataSource } from './app/data-source';

async function main() {
  await appDataSource.initialize();

  const serviceManager = new ServiceManager();
  const store = serviceManager.get(TypeORMStore);
  store.setDataSource(appDataSource);

  const app = await createApp(AppController, { serviceManager });

  const httpServer = http.createServer(app);
  const port = Config.get('port', 'number', 3001);
  httpServer.listen(port, () => displayServerURL(port));
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); });
