import 'source-map-support/register';

// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import { Builder, Nuxt } from 'nuxt';
import { createConnection } from 'typeorm';

// App
import { AppController } from './app/app.controller';

// Import and Set Nuxt.js options
const config = require('../../frontend/nuxt.config.js');
config.dev = Config.get('settings.debug', true);

async function main() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  await createConnection();

  const app = createApp(AppController, {
    postMiddlewares: [
      nuxt.render
    ]
  });

  const httpServer = http.createServer(app);
  const port = Config.get('port', 3001);
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

main();
