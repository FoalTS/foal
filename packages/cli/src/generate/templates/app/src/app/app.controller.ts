import { controller, IAppController } from '@foal/core';

import { ApiController } from './controllers';
import { appDataSource } from './data-source';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
  ];

  async init() {
    await appDataSource.initialize();
  }
}
