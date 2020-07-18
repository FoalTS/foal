import { controller } from '@foal/core';

import { ApiController, OpenapiController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/swagger', OpenapiController)
  ];
}
