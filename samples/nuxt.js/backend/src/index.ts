import 'source-map-support/register';

import { Builder, Nuxt } from 'nuxt';

// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import { createConnection } from 'typeorm';

 // Import and Set Nuxt.js options
 const config = require('../../frontend/nuxt.config.js');
 config.dev = Config.get('settings.debug', true);


// App
import { AppController } from './app/app.controller';

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
  const port = Config.get2('port', 'number', 3001);
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

main()
  .catch(err => { console.error(err); process.exit(1); });
