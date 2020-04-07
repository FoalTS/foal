import { controller } from '@foal/core';

import { ApiController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
  ];
}
