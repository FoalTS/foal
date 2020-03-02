import 'source-map-support/register';

// std
import * as http from 'http';

// 3p
import { Config, createApp } from '@foal/core';
import { connect } from 'mongoose';

// App
import { AppController } from './app/app.controller';

async function main() {
  const uri = Config.getOrThrow('mongodb.uri', 'string');
  connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

  const app = createApp(AppController);

  const httpServer = http.createServer(app);
  const port = Config.get2('port', 'number', 3001);
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

main()
  .catch(err => { console.error(err); process.exit(1); });
