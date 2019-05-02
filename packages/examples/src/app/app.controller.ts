import { controller } from '@foal/core';

import { ApiV2Controller, AuthController, OpenApiController, ViewController } from './controllers';

export class AppController {
  subControllers = [
    controller('', AuthController),
    controller('', ViewController),
    controller('/api', ApiV2Controller),
    controller('/swagger', OpenApiController)
  ];
}
