import 'source-map-support/register';

// 3p
import { Config, createApp, Logger, ServiceManager } from '@foal/core';

// App
import { AppController } from './app/app.controller';
import { dataSource } from './db';

async function main() {
  await dataSource.initialize();

  const serviceManager = new ServiceManager();
  const logger = serviceManager.get(Logger);

  const app = await createApp(AppController, { serviceManager });

  const port = Config.get('port', 'number', 3001);
  app.listen(port, () => logger.info(`Listening on port ${port}...`));
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); });
