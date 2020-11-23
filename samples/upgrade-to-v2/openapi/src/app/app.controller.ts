import { controller } from '@foal/core';

import { ApiController, OpenApiController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/swagger', OpenApiController)
  ];
}
